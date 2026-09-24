import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';

const PYTHON_ATTENDANCE_URL = 'http://127.0.0.1:8000';

export interface PunchResult {
  success: boolean;
  action?: 'IN' | 'OUT';
  employeeId?: string;
  employeeName?: string;
  time?: string;
  message: string;
  mode?: string;
  device?: string;
  latitude?: number;
  longitude?: number;
}

export interface RecentPunch {
  action: 'IN' | 'OUT';
  time: string;
  mode: string;
  location: string | null;
}

export interface RecentPunchesResult {
  punches: RecentPunch[];
}

export interface RegistrationStatusResult {
  registered: boolean;
  totalActiveTemplates: number;
  registeredAngles: string[];
  missingAngles: string[];
  lastUpdated: string | null;
}

export interface FaceStatusResult {
  registered: boolean;
  punchedIn: boolean;
}

export interface EnrollResult {
  success: boolean;
  message: string;
}

interface FaceVerifyResult {
  verified: boolean;
  employeeName?: string;
  matchResult?:
    | 'Matched'
    | 'NoMatch'
    | 'LivenessFailed'
    | 'Error'
    | 'PoorImageQuality';
  livenessCheckPassed?: boolean;
  confidenceScore?: number;
  thresholdUsed?: number;
  serviceUnavailable?: boolean;
  noVectorOnFile?: boolean;
  matchedFaceVectorId?: number | null;
}

interface EmployeeLocationInfo {
  companyId: number;
  branchId: number | null;
}

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  // TODO (TL) — flip this to `true` when ready to actually enforce
  // geofence matching (i.e. block punches from outside an approved
  // location, not just require that SOME coordinates were captured).
  // This is separate from the mandatory-location check in punch() above,
  // which is already always-on regardless of this flag.
  private readonly GEOFENCE_REQUIRED = true;
  private readonly ACCURACY_CHECK_REQUIRED = true;
  private readonly ACCURACY_THRESHOLD_METERS = 200;
  private readonly ESS_DEVICE_ID = 4;
  private readonly ANGLE_LABEL_COLUMN_READY = true;

  // NEW — WFH's punch-out-vs-punch-in self-check. Flag only, never
  // blocks, same philosophy as GEOFENCE_REQUIRED/ACCURACY_CHECK_REQUIRED
  // (both currently true and DO block — this one is deliberately kept
  // flag-only per an explicit decision, not an oversight).
  private readonly WFH_SELF_DISTANCE_THRESHOLD_METERS = 300;

  // Mst_Status IDs, confirmed against the real DB schema (2026-09-24).
  // Only WFH has real logic below right now — Remote and ClientSite
  // fall through as "no special handling", same as any unrecognized
  // value, until those are designed.
  private static readonly PUNCH_MODE = {
    OFFICE: 69,
    WFH: 70,
    REMOTE: 71,
    CLIENT_SITE: 72,
  } as const;

  constructor(
    private readonly http: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}

  async checkFaceRegistered(employeeId: string): Promise<FaceStatusResult> {
    let registered = false;
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query(
          'SELECT 1 AS found FROM EmployeeFaceVectors WHERE EmployeeID = @EmployeeID AND IsActive = 1 AND VectorDimension = 128',
        );
      registered = (result.recordset?.length ?? 0) > 0;
    } catch (err) {
      this.logger.error(
        `checkFaceRegistered failed for ${employeeId} - ${(err as Error).message}`,
      );
    }

    const punchedIn = await this.isCurrentlyPunchedIn(employeeId);

    return { registered, punchedIn };
  }

  private static readonly CAPTURE_SOURCE_LABEL: Record<number, string> = {
    1: 'Biometric',
    2: 'GPS',
    3: 'Face Recognition',
    4: 'QR',
    5: 'Web',
    6: 'Mobile App',
    7: 'Manual Regularization',
  };

  async getRecentPunches(employeeId: string): Promise<RecentPunchesResult> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
        SELECT TOP 10 PunchType, PunchTimestamp, PunchLocation, CaptureSource
        FROM RawPunches
        WHERE EmployeeID = @EmployeeID
        ORDER BY PunchTimestamp DESC
      `);

      // FIX — used to hardcode mode: 'Face Recognition' on every row,
      // justified by CaptureSource=2 supposedly always meaning that. That
      // was never actually correct against Mst_AttendanceCaptureSource
      // (the real lookup table) — it just happened to work because the
      // writing proc and this reading code both independently hardcoded
      // the same wrong number. Now that USP_RecordFaceVerificationPunch
      // and USP_ManualPunchRegularization write the CORRECT values (3 and
      // 7 respectively), this reads the real source instead of assuming.
      const punches: RecentPunch[] = (result.recordset ?? []).map((row) => ({
        action: row.PunchType === 60 ? 'IN' : 'OUT',
        time: new Date(row.PunchTimestamp).toISOString(),
        mode:
          AttendanceService.CAPTURE_SOURCE_LABEL[row.CaptureSource] ??
          'Unknown',
        location: row.PunchLocation ?? null,
      }));

      return { punches };
    } catch (err) {
      this.logger.error(
        `getRecentPunches failed for ${employeeId} - ${(err as Error).message}`,
      );
      return { punches: [] };
    }
  }

  private static readonly ALL_ANGLES = ['front', 'right', 'left', 'up', 'down'];

  async getRegistrationStatus(
    employeeId: string,
  ): Promise<RegistrationStatusResult> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
          SELECT AngleLabel, EnrolledDateTime
          FROM EmployeeFaceVectors
          WHERE EmployeeID = @EmployeeID AND IsActive = 1
          ORDER BY EnrolledDateTime DESC
        `);

      const rows = result.recordset ?? [];

      const registeredAngles: string[] = [];
      for (const row of rows) {
        const label = row.AngleLabel as string | null;
        if (
          label &&
          AttendanceService.ALL_ANGLES.includes(label) &&
          !registeredAngles.includes(label)
        ) {
          registeredAngles.push(label);
        }
      }
      const missingAngles = AttendanceService.ALL_ANGLES.filter(
        (a) => !registeredAngles.includes(a),
      );

      return {
        registered: rows.length > 0,
        totalActiveTemplates: rows.length,
        registeredAngles,
        missingAngles,
        lastUpdated: rows[0]?.EnrolledDateTime
          ? new Date(rows[0].EnrolledDateTime).toISOString()
          : null,
      };
    } catch (err) {
      this.logger.error(
        `getRegistrationStatus failed for ${employeeId} - ${(err as Error).message}`,
      );
      return {
        registered: false,
        totalActiveTemplates: 0,
        registeredAngles: [],
        missingAngles: AttendanceService.ALL_ANGLES,
        lastUpdated: null,
      };
    }
  }

  private async isCurrentlyPunchedIn(employeeId: string): Promise<boolean> {
    const last = await this.getLastPunch(employeeId);
    if (!last || last.typeCode !== 60) return false;

    const crossesMidnight = await this.employeeShiftCrossesMidnight(employeeId);
    if (crossesMidnight) return true;

    const now = new Date();
    const isSameCalendarDay =
      last.timestamp.getFullYear() === now.getFullYear() &&
      last.timestamp.getMonth() === now.getMonth() &&
      last.timestamp.getDate() === now.getDate();
    return isSameCalendarDay;
  }

  private async employeeShiftCrossesMidnight(
    employeeId: string,
  ): Promise<boolean> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
            SELECT TOP 1 sm.IsNightShift
            FROM EmployeeShiftAssignments sa
            JOIN ShiftMaster sm ON sm.ID = sa.ShiftID
            WHERE sa.EmployeeID = @EmployeeID
              AND sa.IsActive = 1
              AND CAST(GETDATE() AS DATE) BETWEEN sa.EffectiveFrom AND ISNULL(sa.EffectiveTo, '2099-12-31')
            ORDER BY sa.Priority ASC
          `);
      const row = result.recordset?.[0];
      return row?.IsNightShift === true;
    } catch (err) {
      this.logger.error(
        `employeeShiftCrossesMidnight failed for ${employeeId} - ${(err as Error).message}`,
      );
      return false;
    }
  }

  async punch(
    employeeId: string,
    frames: Express.Multer.File[],
    latitude?: number,
    longitude?: number,
    device?: string,
    accuracy?: number,
    punchMode?: number,
  ): Promise<PunchResult> {
    if (latitude === undefined || longitude === undefined) {
      return {
        success: false,
        message:
          'Location is required to punch in or out. Please enable location access and try again.',
      };
    }

    if (accuracy !== undefined && accuracy > this.ACCURACY_THRESHOLD_METERS) {
      this.logger.warn(
        `Low-confidence location on punch for ${employeeId} - accuracy: ${accuracy}m (threshold: ${this.ACCURACY_THRESHOLD_METERS}m), lat: ${latitude}, lon: ${longitude}`,
      );
      if (this.ACCURACY_CHECK_REQUIRED) {
        return {
          success: false,
          message:
            "We couldn't get a precise enough location fix. Please try again with GPS/location services enabled, ideally from a phone rather than a hotspot-connected laptop.",
        };
      }
    }

    // NEW — WFH's own 300m self-check needs to know if THIS punch is a
    // WFH one before the geofence check runs below, so it's resolved
    // once, up front.
    const isWfhPunch = punchMode === AttendanceService.PUNCH_MODE.WFH;

    const verify = await this.verifyFace(employeeId, frames);

    if (verify.serviceUnavailable) {
      return {
        success: false,
        message:
          'The attendance service is currently unavailable. Please try again in a moment, or contact IT if this continues.',
      };
    }

    if (verify.noVectorOnFile) {
      return {
        success: false,
        message:
          "You haven't registered your face yet. Please register your face to use this feature.",
      };
    }

    const locationInfo = await this.resolveEmployeeLocation(employeeId);

    // NEW — Office keeps the existing real-geofence check, unchanged.
    // WFH skips it entirely — comparing a home address to the office's
    // GeoFences would never make sense — and gets its own check further
    // below instead (self-referential, against that session's own
    // punch-in location, not the office).
    const geoFenceId =
      !isWfhPunch && latitude !== undefined && longitude !== undefined && locationInfo
        ? await this.findMatchingGeoFence(
            locationInfo.companyId,
            latitude,
            longitude,
          )
        : null;

    if (this.GEOFENCE_REQUIRED && !isWfhPunch && geoFenceId === null) {
      await this.recordVerificationAttempt(
        employeeId,
        verify,
        null,
        latitude,
        longitude,
        geoFenceId,
        locationInfo?.branchId ?? null,
        punchMode ?? null,
      );
      return {
        success: false,
        message:
          "You're outside an approved location for attendance. Please try again from an approved site.",
      };
    }

    const punchType = verify.verified
      ? await this.determineNextPunchType(employeeId)
      : null;

    // NEW — WFH's 300m self-check: only meaningful on a punch-OUT (there's
    // nothing to compare an IN against yet — it establishes the baseline
    // for this session). Flag only, never blocks, per explicit decision —
    // same as ACCURACY_CHECK_REQUIRED's pattern, just permanently
    // non-blocking rather than toggled by a flag.
    if (isWfhPunch && punchType === 'OUT' && verify.verified) {
      await this.checkWfhSelfDistance(employeeId, latitude, longitude);
    }

    const recorded = await this.recordVerificationAttempt(
      employeeId,
      verify,
      punchType,
      latitude,
      longitude,
      geoFenceId,
      locationInfo?.branchId ?? null,
      punchMode ?? null,
    );

    if (!verify.verified) {
      // PoorImageQuality means the Python service detected the frame was
      // too dark to reliably detect/encode a face, even after its own
      // CLAHE low-light rescue attempt. Without this branch it would fall
      // through to the generic "didn't match" message below, which is
      // actively misleading — it implies an identity mismatch when the
      // real problem is lighting.
      const message =
        verify.matchResult === 'LivenessFailed'
          ? "We couldn't confirm a live face — please look directly at the camera and blink naturally, then try again."
          : verify.matchResult === 'PoorImageQuality'
            ? "It's too dark to verify your face clearly. Please move somewhere brighter and try again."
            : "Face didn't match. Please try again, or contact HR if this keeps happening.";
      return { success: false, message };
    }

    if (!recorded.ok) {
      return {
        success: false,
        message: 'Could not record the punch. Please try again.',
      };
    }

    if (punchType && latitude !== undefined && longitude !== undefined) {
      this.resolvePunchLocationInBackground(employeeId, latitude, longitude);
    }

    return {
      success: true,
      action: punchType ?? undefined,
      employeeId,
      employeeName: verify.employeeName,
      time: new Date().toISOString(),
      message: `${verify.employeeName ?? 'Employee'} — ${punchType === 'OUT' ? 'checked out' : 'checked in'} successfully.`,
      mode: 'Face Recognition',
      device,
      latitude,
      longitude,
    };
  }

  // NEW — compares this WFH punch-OUT's coordinates against the most
  // recent WFH punch already on record for this employee (their punch-IN
  // for this same session). Flag only — logs a warning, never blocks or
  // affects the punch's success in any way. Deliberately does NOT try to
  // scope "same session" by date/shift — just "their most recent WFH
  // punch, period" — mirroring the same simple, no-date-filter approach
  // getLastPunch() already uses for the general punch-state logic.
  private async checkWfhSelfDistance(
    employeeId: string,
    currentLat: number,
    currentLon: number,
  ): Promise<void> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('PunchMode', sql.Int, AttendanceService.PUNCH_MODE.WFH).query(`
          SELECT TOP 1 Latitude, Longitude
          FROM RawPunches
          WHERE EmployeeID = @EmployeeID
            AND PunchMode = @PunchMode
            AND Latitude IS NOT NULL AND Longitude IS NOT NULL
          ORDER BY PunchTimestamp DESC
        `);
      const row = result.recordset?.[0];
      if (!row) return; // no prior WFH punch-in on record — nothing to compare against

      const distance = AttendanceService.haversineMeters(
        currentLat,
        currentLon,
        Number(row.Latitude),
        Number(row.Longitude),
      );

      if (distance > this.WFH_SELF_DISTANCE_THRESHOLD_METERS) {
        this.logger.warn(
          `WFH punch-out far from punch-in location for ${employeeId} - distance: ${Math.round(distance)}m (threshold: ${this.WFH_SELF_DISTANCE_THRESHOLD_METERS}m)`,
        );
      }
    } catch (err) {
      this.logger.error(
        `checkWfhSelfDistance failed for ${employeeId} - ${(err as Error).message}`,
      );
    }
  }

  private static readonly PUNCH_TYPE_CODE: Record<'IN' | 'OUT', string> = {
    IN: '60',
    OUT: '61',
  };

  private async determineNextPunchType(
    employeeId: string,
  ): Promise<'IN' | 'OUT'> {
    const punchedIn = await this.isCurrentlyPunchedIn(employeeId);
    return punchedIn ? 'OUT' : 'IN';
  }

  private async getLastPunch(
    employeeId: string,
  ): Promise<{ typeCode: number; timestamp: Date } | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
          SELECT TOP 1 PunchType, PunchTimestamp
          FROM RawPunches
          WHERE EmployeeID = @EmployeeID
          ORDER BY PunchTimestamp DESC
        `);
      const row = result.recordset?.[0];
      if (!row) return null;
      return {
        typeCode: row.PunchType,
        timestamp: new Date(row.PunchTimestamp),
      };
    } catch (err) {
      this.logger.error(
        `getLastPunch failed for ${employeeId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  private async verifyFace(
    employeeId: string,
    frames: Express.Multer.File[],
  ): Promise<FaceVerifyResult> {
    const form = new FormData();
    form.append('employeeId', employeeId);
    frames.forEach((frame, i) => {
      form.append('frames', frame.buffer, {
        filename: frame.originalname || `frame_${i}.jpg`,
        contentType: frame.mimetype || 'image/jpeg',
      });
    });

    try {
      const response = await firstValueFrom(
        this.http.post(`${PYTHON_ATTENDANCE_URL}/verify`, form, {
          headers: form.getHeaders(),
          timeout: 20000,
        }),
      );
      return response.data as FaceVerifyResult;
    } catch (err) {
      const error = err as {
        code?: string;
        message?: string;
        response?: { status?: number; data?: unknown };
      };
      // Permanent diagnostic logging, not a temporary debug leftover —
      // confirmed genuinely useful in real testing (2026-09-17): a bare
      // error.message alone can be blank/unhelpful for some connection
      // failures, but this full shape (code, message, and whatever the
      // Python service's own response status/body was, if any) reliably
      // surfaces the real cause. Kept here deliberately, not slated for
      // removal.
      this.logger.error(
        `Face-verify service call failed - code: ${error.code}, message: ${error.message}, ` +
          `responseStatus: ${error.response?.status}, responseData: ${JSON.stringify(error.response?.data)}`,
      );
      const isServiceDown =
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND';
      return { verified: false, serviceUnavailable: isServiceDown };
    }
  }

  private async recordVerificationAttempt(
    claimedEmployeeId: string,
    verify: FaceVerifyResult,
    punchType: 'IN' | 'OUT' | null,
    latitude?: number,
    longitude?: number,
    geoFenceId?: number | null,
    clientLocationId?: number | null,
    punchMode?: number | null,
  ): Promise<{ ok: boolean }> {
    try {
      const pool = await this.databaseService.connect();
      await pool
        .request()
        .input('ClaimedEmployeeID', sql.VarChar(25), claimedEmployeeId)
        .input(
          'MatchedEmployeeID',
          sql.VarChar(25),
          verify.verified ? claimedEmployeeId : null,
        )
        .input('FaceVectorID', sql.Int, verify.matchedFaceVectorId ?? null)
        .input('DeviceID', sql.Int, this.ESS_DEVICE_ID)
        .input(
          'ConfidenceScore',
          sql.Decimal(5, 2),
          verify.confidenceScore ?? 0,
        )
        .input('ThresholdUsed', sql.Decimal(5, 2), verify.thresholdUsed ?? 0)
        .input('ModelVersionUsed', sql.NVarChar(30), 'dlib-face-recognition-v1')
        .input(
          'LivenessCheckPassed',
          sql.Bit,
          verify.livenessCheckPassed ?? false,
        )
        .input('MatchResult', sql.NVarChar(20), verify.matchResult ?? 'Error')
        .input('CapturedImagePath', sql.NVarChar(500), null)
        .input(
          'PunchType',
          sql.NVarChar(10),
          punchType ? AttendanceService.PUNCH_TYPE_CODE[punchType] : null,
        )
        .input('Latitude', sql.Decimal(9, 6), latitude ?? null)
        .input('Longitude', sql.Decimal(9, 6), longitude ?? null)
        .input('GeoFenceID', sql.Int, geoFenceId ?? null)
        .input('ClientLocationID', sql.Int, clientLocationId ?? null)
        .input('PunchMode', sql.Int, punchMode ?? null)
        .input('PunchLocation', sql.VarChar(sql.MAX), null)
        .execute('USP_RecordFaceVerificationPunch');
      return { ok: true };
    } catch (err) {
      this.logger.error(
        `recordVerificationAttempt failed for ${claimedEmployeeId} - ${(err as Error).message}`,
      );
      return { ok: false };
    }
  }

  private resolvePunchLocationInBackground(
    employeeId: string,
    latitude: number,
    longitude: number,
  ): void {
    void (async () => {
      const rawPunchId = await this.getLatestRawPunchId(employeeId);
      if (!rawPunchId) return;

      const locationText = await this.reverseGeocode(latitude, longitude);
      if (!locationText) return;

      await this.updatePunchLocation(rawPunchId, locationText);
    })().catch((err) => {
      this.logger.error(
        `resolvePunchLocationInBackground failed for ${employeeId} - ${(err as Error).message}`,
      );
    });
  }

  private async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.http.get('https://nominatim.openstreetmap.org/reverse', {
          params: { format: 'jsonv2', lat: latitude, lon: longitude },
          headers: {
            'User-Agent':
              'KTS-People360-Attendance/1.0 (internal HRMS attendance system)',
          },
          timeout: 5000,
        }),
      );
      return response.data?.display_name ?? null;
    } catch (err) {
      this.logger.error(
        `reverseGeocode failed for (${latitude}, ${longitude}) - ${(err as Error).message}`,
      );
      return null;
    }
  }

  private async getLatestRawPunchId(
    employeeId: string,
  ): Promise<number | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query(
          'SELECT TOP 1 ID FROM RawPunches WHERE EmployeeID = @EmployeeID ORDER BY ID DESC',
        );
      return result.recordset?.[0]?.ID ?? null;
    } catch (err) {
      this.logger.error(
        `getLatestRawPunchId failed for ${employeeId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  private async updatePunchLocation(
    rawPunchId: number,
    locationText: string,
  ): Promise<void> {
    try {
      const pool = await this.databaseService.connect();
      await pool
        .request()
        .input('RawPunchID', sql.BigInt, rawPunchId)
        .input('PunchLocation', sql.VarChar(sql.MAX), locationText)
        .execute('USP_UpdatePunchLocation');
    } catch (err) {
      this.logger.error(
        `updatePunchLocation failed for RawPunches ID ${rawPunchId} - ${(err as Error).message}`,
      );
    }
  }

  private async resolveEmployeeLocation(
    employeeId: string,
  ): Promise<EmployeeLocationInfo | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query(
          'SELECT CompanyID, BranchID FROM Employee WHERE EmployeeID = @EmployeeID',
        );
      const row = result.recordset?.[0];
      if (!row) return null;
      return { companyId: row.CompanyID, branchId: row.BranchID ?? null };
    } catch (err) {
      this.logger.error(
        `resolveEmployeeLocation failed for ${employeeId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  private async findMatchingGeoFence(
    companyId: number,
    latitude: number,
    longitude: number,
  ): Promise<number | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request().input('CompanyID', sql.Int, companyId)
        .query(`
          SELECT ID, Latitude, Longitude, RadiusMeters
          FROM GeoFences
          WHERE CompanyID = @CompanyID AND IsActive = 1
        `);

      let closestId: number | null = null;
      let closestDistance = Infinity;

      for (const fence of result.recordset ?? []) {
        if (fence.RadiusMeters == null) continue;
        const distance = AttendanceService.haversineMeters(
          latitude,
          longitude,
          Number(fence.Latitude),
          Number(fence.Longitude),
        );
        if (distance <= fence.RadiusMeters && distance < closestDistance) {
          closestDistance = distance;
          closestId = fence.ID;
        }
      }

      return closestId;
    } catch (err) {
      this.logger.error(
        `findMatchingGeoFence failed for company ${companyId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  private static haversineMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async enrollFace(
    employeeId: string,
    frames: Express.Multer.File[],
  ): Promise<EnrollResult> {
    const computed = await this.computeFaceVectors(frames);

    if (computed.serviceUnavailable) {
      return {
        success: false,
        message:
          'The attendance service is currently unavailable. Please try again in a moment.',
      };
    }
    if (
      !computed.success ||
      !computed.vectors ||
      computed.vectors.length === 0
    ) {
      return {
        success: false,
        message:
          computed.message ??
          "Couldn't register your face clearly. Please try again in good lighting, facing the camera directly.",
      };
    }

    try {
      const pool = await this.databaseService.connect();

      await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('Reason', sql.NVarChar(100), 'Superseded by new enrollment')
        .execute('USP_DeactivateEmployeeFaceVectors');

      let savedCount = 0;
      for (const { angleLabel, vectorBase64 } of computed.vectors) {
        const vectorBuffer = Buffer.from(vectorBase64, 'base64');
        const request = pool
          .request()
          .input('EmployeeID', sql.VarChar(25), employeeId)
          .input('FaceVector', sql.VarBinary(sql.MAX), vectorBuffer)
          .input('VectorDimension', sql.SmallInt, computed.vectorDimension)
          .input('ModelVersion', sql.NVarChar(30), computed.modelVersion)
          .input('EnrolledBy', sql.VarChar(25), employeeId)
          .input('Reason', sql.NVarChar(100), 'Initial enrollment');

        if (this.ANGLE_LABEL_COLUMN_READY) {
          request.input('AngleLabel', sql.NVarChar(20), angleLabel ?? null);
        }

        const result = await request.execute('USP_EnrollEmployeeFaceVector');

        const row = result.recordset?.[0];
        if (row?.FaceVectorID) {
          savedCount++;
        } else {
          this.logger.error(
            `enrollFace: one template failed to save for ${employeeId} - ${row?.Message ?? 'unknown reason'}`,
          );
        }
      }

      if (savedCount === 0) {
        return {
          success: false,
          message: 'Could not register your face. Please try again.',
        };
      }

      return {
        success: true,
        message: `Face registered successfully (${savedCount} angle${savedCount === 1 ? '' : 's'} saved). You can now use it to punch in and out.`,
      };
    } catch (err) {
      this.logger.error(
        `enrollFace failed for ${employeeId} - ${(err as Error).message}`,
      );
      return {
        success: false,
        message: 'Could not register your face. Please try again.',
      };
    }
  }

  async checkEnrollmentFrame(frame: Express.Multer.File): Promise<{
    passed: boolean;
    reason?: string | null;
    message: string;
  }> {
    const form = new FormData();
    form.append('frame', frame.buffer, {
      filename: frame.originalname || 'frame.jpg',
      contentType: frame.mimetype || 'image/jpeg',
    });
    try {
      const response = await firstValueFrom(
        this.http.post(`${PYTHON_ATTENDANCE_URL}/enroll/check-frame`, form, {
          headers: form.getHeaders(),
          timeout: 8000,
        }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(
        `checkEnrollmentFrame failed - ${(err as Error).message}`,
      );
      return { passed: true, message: '' };
    }
  }

  private async computeFaceVectors(frames: Express.Multer.File[]): Promise<{
    success: boolean;
    vectors?: { angleLabel: string | null; vectorBase64: string }[];
    vectorDimension?: number;
    modelVersion?: string;
    message?: string;
    serviceUnavailable?: boolean;
  }> {
    const form = new FormData();
    frames.forEach((frame, i) => {
      form.append('frames', frame.buffer, {
        filename: frame.originalname || `frame_${i}.jpg`,
        contentType: frame.mimetype || 'image/jpeg',
      });
    });
    try {
      const response = await firstValueFrom(
        this.http.post(`${PYTHON_ATTENDANCE_URL}/enroll`, form, {
          headers: form.getHeaders(),
          timeout: 20000,
        }),
      );
      return response.data;
    } catch (err) {
      const error = err as { code?: string; message?: string };
      this.logger.error(`Face-enroll compute call failed: ${error.message}`);
      const isServiceDown =
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND';
      return { success: false, serviceUnavailable: isServiceDown };
    }
  }
}
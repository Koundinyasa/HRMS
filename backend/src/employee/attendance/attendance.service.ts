import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as sql from 'mssql';
import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
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
  // PHOTO — true when the active enrollment has a saved profile photo.
  hasPhoto?: boolean;
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

// What the location card under the camera shows. Purely informational —
// nothing here changes whether a punch is accepted or rejected.
export interface LocationCheckResult {
  enabled: boolean;
  // Closest approved office geofence: how far the employee is from its
  // centre, and its radius. Outside by (distanceMeters - radiusMeters).
  // bearingDegrees: the direction of the employee from the fence centre
  // (0 = north, 90 = east), so the on-screen radar can put the dot in the
  // right place.
  office: {
    fenceId: number;
    distanceMeters: number;
    radiusMeters: number;
    bearingDegrees: number;
  } | null;
  // WFH's 300m reference: today's first punch-in. null unless
  // EXPOSE_WFH_COMPARISON is on — employees must not see this.
  wfh:
    | {
        status: 'compared';
        distanceMeters: number;
        thresholdMeters: number;
        bearingDegrees: number;
      }
    | { status: 'no-punch-in-today' }
    | { status: 'first-punch-in-not-wfh' }
    | { status: 'no-coordinates' }
    | null;
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

  // Street address for each punch, looked up from the public OpenStreetMap
  // service (nominatim.openstreetmap.org) while the punch is being saved
  // (waits at most 3 seconds, then the coordinates text is used). This sends
  // the punch coordinates outside the company. It is on by default; set
  // PUNCH_ADDRESS_LOOKUP=false in the backend .env to switch it off.
  private readonly ADDRESS_LOOKUP_ENABLED =
    process.env.PUNCH_ADDRESS_LOOKUP !== 'false';

  // PHOTO — step-6 profile photo saved at enrollment. The image file goes
  // in FACE_PHOTO_DIR and only its RELATIVE path (<EmployeeID>/<guid>.jpg)
  // is stored, in EmployeeFaceVectors.ImagePath. Run the ImagePath
  // migration first; until then the photo is skipped (and logged) but
  // enrollment itself still succeeds. Override the folder with the
  // FACE_PHOTO_DIR env var if the photos should live elsewhere.
  private readonly IMAGE_PATH_COLUMN_READY = true;
  private readonly FACE_PHOTO_DIR =
    process.env.FACE_PHOTO_DIR ??
    path.join(process.cwd(), 'src', 'employee', 'attendance', 'photos');
  private readonly FACE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

  // NEW — WFH's punch-out-vs-punch-in self-check. Flag only, never
  // blocks, same philosophy as GEOFENCE_REQUIRED/ACCURACY_CHECK_REQUIRED
  // (both currently true and DO block — this one is deliberately kept
  // flag-only per an explicit decision, not an oversight).
  private readonly WFH_SELF_DISTANCE_THRESHOLD_METERS = 300;

  // The location card under the camera (GET /employee/attendance/location-check)
  // is a permanent feature: it shows the employee where they are and, for
  // Office, how far they are from the approved location.
  //
  // The WFH comparison (distance from that day's first punch-in) must stay
  // invisible to employees, so the server does NOT send it unless this is
  // switched on. Turn it on only while you test the 300m check yourself;
  // leave it false in production.
  private readonly EXPOSE_WFH_COMPARISON = false;

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
          SELECT AngleLabel, EnrolledDateTime${this.IMAGE_PATH_COLUMN_READY ? ', ImagePath' : ''}
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
        hasPhoto: rows.some((r) => !!r.ImagePath),
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

    // "Today" is decided by the database's own clock (the same clock that
    // stamps RawPunches), not this server's, so it stays correct no matter
    // which timezone the backend is deployed in.
    return last.isToday;
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
      this.logger.warn(
        `Punch rejected (no location sent) for ${employeeId} - mode: ${punchMode ?? 'not sent'}`,
      );
      return {
        success: false,
        message:
          'Location is required to punch in or out. Please enable location access and try again.',
      };
    }

    if (
      accuracy === undefined ||
      Number.isNaN(accuracy) ||
      accuracy > this.ACCURACY_THRESHOLD_METERS
    ) {
      this.logger.warn(
        `Punch rejected (location accuracy) for ${employeeId} - accuracy: ${accuracy === undefined ? 'not sent' : accuracy + 'm'} (threshold: ${this.ACCURACY_THRESHOLD_METERS}m), lat: ${latitude}, lon: ${longitude}`,
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
      this.logger.warn(`Punch rejected (no face registered) for ${employeeId}`);
      return {
        success: false,
        message:
          "You haven't registered your face yet. Please register your face to use this feature.",
      };
    }

    const locationInfo = await this.resolveEmployeeLocation(employeeId);

    const geoFenceId =
      !isWfhPunch &&
      latitude !== undefined &&
      longitude !== undefined &&
      locationInfo
        ? await this.findMatchingGeoFence(
            locationInfo.companyId,
            latitude,
            longitude,
          )
        : null;

    if (this.GEOFENCE_REQUIRED && !isWfhPunch && geoFenceId === null) {
      this.logger.warn(
        `Punch rejected (outside approved location) for ${employeeId} - lat: ${latitude}, lon: ${longitude}, accuracy: ${accuracy}m, mode: ${punchMode ?? 'not sent'}`,
      );
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

    // Location text saved with the punch. Normally the street address; when
    // the lookup is off, slow or fails, the coordinates text instead. It is
    // worked out BEFORE the punch is saved, so the punch row is written once
    // and never updated afterwards.
    let punchLocation = AttendanceService.describePunchLocation(
      latitude,
      longitude,
      geoFenceId,
      isWfhPunch,
    );
    if (this.ADDRESS_LOOKUP_ENABLED && verify.verified) {
      const address = await this.reverseGeocode(latitude, longitude);
      if (address) punchLocation = address;
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
      punchLocation,
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

  // Compares this WFH punch-OUT's coordinates against TODAY'S FIRST
  // punch-IN (the morning punch-in). Flag only — logs a warning, never
  // blocks or affects the punch's success in any way.
  //
  // The comparison only happens if that first punch-in of the day was
  // itself a WFH punch. If the day started in another mode (e.g. Office
  // in, WFH out), or the punch-in has no coordinates, or there is no
  // punch-in today at all, there is nothing to compare against — it
  // skips quietly and the punch-out just goes through.
  private async checkWfhSelfDistance(
    employeeId: string,
    currentLat: number,
    currentLon: number,
  ): Promise<void> {
    try {
      const first = await this.getTodaysFirstPunchIn(employeeId);
      if (
        !first ||
        first.punchMode !== AttendanceService.PUNCH_MODE.WFH ||
        first.latitude === null ||
        first.longitude === null
      ) {
        return;
      }

      const distance = AttendanceService.haversineMeters(
        currentLat,
        currentLon,
        first.latitude,
        first.longitude,
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

  // Today's first punch-IN for this employee — the reference point for the
  // WFH 300m check. Shared by checkWfhSelfDistance (the real check) and
  // getLocationCheck (the on-screen display), so the number an employee
  // sees comes from exactly the same row the check uses.
  private async getTodaysFirstPunchIn(employeeId: string): Promise<{
    punchMode: number | null;
    latitude: number | null;
    longitude: number | null;
  } | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
          SELECT TOP 1 PunchMode, Latitude, Longitude
          FROM RawPunches
          WHERE EmployeeID = @EmployeeID
            AND PunchType = 60
            AND PunchTimestamp >= CAST(GETDATE() AS DATE)
            AND PunchTimestamp <  DATEADD(DAY, 1, CAST(GETDATE() AS DATE))
          ORDER BY PunchTimestamp ASC
        `);
      const row = result.recordset?.[0];
      if (!row) return null;
      return {
        punchMode: row.PunchMode ?? null,
        latitude: row.Latitude == null ? null : Number(row.Latitude),
        longitude: row.Longitude == null ? null : Number(row.Longitude),
      };
    } catch (err) {
      this.logger.error(
        `getTodaysFirstPunchIn failed for ${employeeId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  // The approved office geofence the employee is closest to, judged by how
  // far past its edge they are (distance - radius), so "inside" here means
  // exactly what findMatchingGeoFence means by inside.
  private async getNearestGeoFence(
    companyId: number,
    latitude: number,
    longitude: number,
  ): Promise<{
    fenceId: number;
    distanceMeters: number;
    radiusMeters: number;
    bearingDegrees: number;
  } | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request().input('CompanyID', sql.Int, companyId)
        .query(`
          SELECT ID, Latitude, Longitude, RadiusMeters
          FROM GeoFences
          WHERE CompanyID = @CompanyID AND IsActive = 1
        `);

      let best: {
        fenceId: number;
        distance: number;
        radius: number;
        margin: number;
        bearing: number;
      } | null = null;

      for (const fence of result.recordset ?? []) {
        if (fence.RadiusMeters == null) continue;
        const distance = AttendanceService.haversineMeters(
          latitude,
          longitude,
          Number(fence.Latitude),
          Number(fence.Longitude),
        );
        const radius = Number(fence.RadiusMeters);
        const margin = distance - radius;
        if (!best || margin < best.margin) {
          best = {
            fenceId: fence.ID,
            distance,
            radius,
            margin,
            bearing: AttendanceService.bearingDegrees(
              Number(fence.Latitude),
              Number(fence.Longitude),
              latitude,
              longitude,
            ),
          };
        }
      }

      return best
        ? {
            fenceId: best.fenceId,
            distanceMeters: Math.round(best.distance),
            radiusMeters: best.radius,
            bearingDegrees: Math.round(best.bearing),
          }
        : null;
    } catch (err) {
      this.logger.error(
        `getNearestGeoFence failed for company ${companyId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  // Backs the coordinates/distance panel in the punch modal. Read-only:
  // it never records anything and never affects a punch.
  async getLocationCheck(
    employeeId: string,
    latitude: number,
    longitude: number,
  ): Promise<LocationCheckResult> {
    const locationInfo = await this.resolveEmployeeLocation(employeeId);
    const office = locationInfo
      ? await this.getNearestGeoFence(
          locationInfo.companyId,
          latitude,
          longitude,
        )
      : null;

    // The WFH comparison is only worked out — and only sent — while
    // EXPOSE_WFH_COMPARISON is on. Otherwise it is never even looked up.
    let wfh: LocationCheckResult['wfh'] = null;
    if (this.EXPOSE_WFH_COMPARISON) {
      const first = await this.getTodaysFirstPunchIn(employeeId);
      if (!first) {
        wfh = { status: 'no-punch-in-today' };
      } else if (first.punchMode !== AttendanceService.PUNCH_MODE.WFH) {
        wfh = { status: 'first-punch-in-not-wfh' };
      } else if (first.latitude === null || first.longitude === null) {
        wfh = { status: 'no-coordinates' };
      } else {
        wfh = {
          status: 'compared',
          distanceMeters: Math.round(
            AttendanceService.haversineMeters(
              latitude,
              longitude,
              first.latitude,
              first.longitude,
            ),
          ),
          thresholdMeters: this.WFH_SELF_DISTANCE_THRESHOLD_METERS,
          bearingDegrees: Math.round(
            AttendanceService.bearingDegrees(
              first.latitude,
              first.longitude,
              latitude,
              longitude,
            ),
          ),
        };
      }
    }

    return { enabled: true, office, wfh };
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
  ): Promise<{ typeCode: number; timestamp: Date; isToday: boolean } | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
          SELECT TOP 1
            PunchType,
            PunchTimestamp,
            CASE WHEN CAST(PunchTimestamp AS DATE) = CAST(GETDATE() AS DATE)
                 THEN 1 ELSE 0 END AS IsToday
          FROM RawPunches
          WHERE EmployeeID = @EmployeeID
          ORDER BY PunchTimestamp DESC
        `);
      const row = result.recordset?.[0];
      if (!row) return null;
      return {
        typeCode: row.PunchType,
        timestamp: new Date(row.PunchTimestamp),
        isToday: row.IsToday === 1,
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

  // The location text saved with a punch and shown in the punch lists. It is
  // built here from the punch itself, so no coordinates leave the company
  // (no address lookup on a public map service).
  private static describePunchLocation(
    latitude: number,
    longitude: number,
    geoFenceId: number | null,
    isWfhPunch: boolean,
  ): string {
    const coordinates = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    if (isWfhPunch) return `Work from home (${coordinates})`;
    if (geoFenceId !== null) return `Approved office location (${coordinates})`;
    return coordinates;
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
    punchLocation?: string | null,
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
        .input('PunchLocation', sql.VarChar(sql.MAX), punchLocation ?? null)
        .execute('USP_RecordFaceVerificationPunch');
      return { ok: true };
    } catch (err) {
      this.logger.error(
        `recordVerificationAttempt failed for ${claimedEmployeeId} - ${(err as Error).message}`,
      );
      return { ok: false };
    }
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
          timeout: 3000,
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

  // Compass direction from point 1 to point 2, in degrees: 0 = north,
  // 90 = east, 180 = south, 270 = west.
  private static bearingDegrees(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
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
    photo?: Express.Multer.File,
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

      // PHOTO — only after the vectors are safely saved. Never throws: a
      // photo problem must not undo or fail a successful registration.
      if (photo) {
        await this.saveEnrollmentPhoto(employeeId, photo);
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

  // PHOTO — the relative path of the active enrollment's profile photo, or
  // null when there is none (older registrations, or the column not there
  // yet). Never throws.
  private async getActivePhotoPath(employeeId: string): Promise<string | null> {
    if (!this.IMAGE_PATH_COLUMN_READY) return null;
    try {
      const pool = await this.databaseService.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId).query(`
          SELECT TOP 1 ImagePath
          FROM EmployeeFaceVectors
          WHERE EmployeeID = @EmployeeID AND IsActive = 1 AND ImagePath IS NOT NULL
          ORDER BY EnrolledDateTime DESC
        `);
      return (result.recordset?.[0]?.ImagePath as string | undefined) ?? null;
    } catch (err) {
      this.logger.error(
        `getActivePhotoPath failed for ${employeeId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  // PHOTO — the logged-in employee's own enrollment photo as bytes, or null
  // if there is none or the file can't be read. The stored path is checked
  // to stay inside FACE_PHOTO_DIR before anything is read from disk.
  async getFacePhoto(employeeId: string): Promise<Buffer | null> {
    const relativePath = await this.getActivePhotoPath(employeeId);
    if (!relativePath) return null;

    const root = path.resolve(this.FACE_PHOTO_DIR);
    const absolutePath = path.resolve(root, relativePath);
    if (!absolutePath.startsWith(root + path.sep)) {
      this.logger.warn(
        `getFacePhoto: stored path for ${employeeId} points outside the photos folder - refused`,
      );
      return null;
    }
    try {
      return await fs.readFile(absolutePath);
    } catch (err) {
      this.logger.warn(
        `getFacePhoto: could not read the photo file for ${employeeId} - ${(err as Error).message}`,
      );
      return null;
    }
  }

  // PHOTO — writes the step-6 photo to disk and records its relative path
  // on this employee's ACTIVE face-vector rows (the ones just enrolled).
  // Best-effort: every failure is logged and swallowed, and a file whose
  // DB update failed is removed so no orphan images pile up.
  private async saveEnrollmentPhoto(
    employeeId: string,
    photo: Express.Multer.File,
  ): Promise<void> {
    if (!this.IMAGE_PATH_COLUMN_READY) return;

    let absolutePath: string | null = null;
    try {
      const data = photo.buffer;
      const isJpeg =
        !!data &&
        data.length > 3 &&
        data[0] === 0xff &&
        data[1] === 0xd8 &&
        data[2] === 0xff;
      if (!isJpeg || data.length > this.FACE_PHOTO_MAX_BYTES) {
        this.logger.warn(
          `saveEnrollmentPhoto: photo for ${employeeId} skipped (not a JPEG or over ${this.FACE_PHOTO_MAX_BYTES} bytes)`,
        );
        return;
      }

      // EmployeeID comes from the JWT, but is still stripped to safe
      // characters so it can never form a path outside the photos folder.
      const safeId = employeeId.replace(/[^A-Za-z0-9_-]/g, '');
      if (!safeId) return;

      const relativePath = `${safeId}/${randomUUID()}.jpg`;
      absolutePath = path.join(this.FACE_PHOTO_DIR, relativePath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, data);

      const pool = await this.databaseService.connect();
      await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('ImagePath', sql.NVarChar(260), relativePath)
        .query(
          'UPDATE EmployeeFaceVectors SET ImagePath = @ImagePath WHERE EmployeeID = @EmployeeID AND IsActive = 1',
        );
    } catch (err) {
      this.logger.error(
        `saveEnrollmentPhoto failed for ${employeeId} - ${(err as Error).message}`,
      );
      if (absolutePath) {
        await fs.unlink(absolutePath).catch(() => undefined);
      }
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

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
 
const PYTHON_ATTENDANCE_URL = 'http://localhost:8000';
 
export interface PunchResult {
  success: boolean;
  action?: 'IN' | 'OUT';
  employeeId?: string;
  employeeName?: string;
  time?: string;
  message: string;
  // NEW — everything known instantly at punch time, for the immediate
  // post-punch details card. PunchLocation (the resolved address) is
  // deliberately NOT here — it isn't known yet at response time (see
  // resolvePunchLocationInBackground) and only ever shows up later, once
  // fetched via getRecentPunches below.
  mode?: string;
  device?: string;
  latitude?: number;
  longitude?: number;
}
 
export interface RecentPunch {
  action: 'IN' | 'OUT';
  time: string;
  mode: string;
  // null = either no coordinates were captured for this punch, or the
  // background geocoding hasn't completed/failed — the frontend can't
  // tell these apart and shouldn't need to; both just render as "pending".
  location: string | null;
}
 
export interface RecentPunchesResult {
  punches: RecentPunch[];
}
 
// Backs the "Manage Face Registration" view. registeredAngles/missingAngles
// only become meaningful once ANGLE_LABEL_COLUMN_READY is true and
// existing rows have real labels — until then, angleLabel is NULL on
// every row, so every angle correctly shows as "unknown" rather than
// falsely claiming a specific one is missing when we just don't know.
export interface RegistrationStatusResult {
  registered: boolean;
  totalActiveTemplates: number;
  registeredAngles: string[];
  missingAngles: string[];
  lastUpdated: string | null;
}
 
export interface FaceStatusResult {
  registered: boolean;
  // NEW — tells the frontend the employee's real current punch state,
  // fetched fresh from RawPunches. Without this, AttendanceCard has no way
  // to know "was I already punched in" on page load/login — it would
  // otherwise always start assuming "punched out", which is wrong the
  // moment someone refreshes or logs back in mid-shift.
  punchedIn: boolean;
}
 
// REMOVED — EarlyLateInfo / TodaySummaryResult used to be defined here.
// The DB team merged the same "today summary" data directly into
// USP_GetUserInfo instead — the dashboard's getProfile() already returns
// it (result.recordsets[3][0]). AttendanceCard.tsx now reads it from the
// shared dashboard profile query, not a separate attendance endpoint.
 
export interface EnrollResult {
  success: boolean;
  message: string;
}
 
interface FaceVerifyResult {
  verified: boolean;
  employeeName?: string;
  matchResult?: 'Matched' | 'NoMatch' | 'LivenessFailed' | 'Error';
  livenessCheckPassed?: boolean;
  confidenceScore?: number;
  thresholdUsed?: number;
  serviceUnavailable?: boolean;
  noVectorOnFile?: boolean;
  // NEW — which specific gallery template (EmployeeFaceVectors.ID) this
  // match came from, only set when verified is true. Lets
  // FaceVerificationAttempts.FaceVectorID actually mean something instead
  // of always being NULL.
  matchedFaceVectorId?: number | null;
}
 
interface EmployeeLocationInfo {
  companyId: number;
  branchId: number | null;
}
 
@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);
 
  // FLAG — currently punches outside every geofence are still accepted
  // (GeoFenceID just ends up NULL). Confirmed with the team: this becomes
  // mandatory later. When that happens, flip this to true — punch() below
  // already has the branch point that checks it, nothing else needs to
  // change.
  private readonly GEOFENCE_REQUIRED = false;
 
  // Confirmed with the TL: BiometricDevices.ID 4 ("ESS", DeviceType 2 =
  // FaceRecognition, serial BIO-HYD-002) is a real, dedicated row created
  // specifically to represent employee self-service webcam punches — not
  // a physical kiosk. Safe to use as DeviceID on every face-recognition
  // punch, unlike guessing an ID from the wrong lookup table (see prior
  // discussion — BiometricDeviceType and BiometricDevices are different
  // tables, easy to conflate since both happened to use ID 2 for
  // something FaceRecognition-related).
  private readonly ESS_DEVICE_ID = 4;
 
  // FLAG — set to true only once the TL has confirmed BOTH the
  // EmployeeFaceVectors.AngleLabel column AND the updated
  // USP_EnrollEmployeeFaceVector (with the new @AngleLabel parameter)
  // are actually live. Calling the proc with an @AngleLabel input before
  // that column/parameter exists will make EVERY enrollment fail
  // outright — SQL Server rejects a call with a parameter the proc
  // doesn't recognize. Defaults to false so enrollment keeps working
  // exactly as it does today until this is deliberately flipped.
  private readonly ANGLE_LABEL_COLUMN_READY =true;
 
  constructor(
    private readonly http: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}
 
  async checkFaceRegistered(employeeId: string): Promise<FaceStatusResult> {
    let registered = false;
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query('SELECT 1 AS found FROM EmployeeFaceVectors WHERE EmployeeID = @EmployeeID AND IsActive = 1 AND VectorDimension = 128');
      registered = (result.recordset?.length ?? 0) > 0;
    } catch (err) {
      this.logger.error(`checkFaceRegistered failed for ${employeeId} - ${(err as Error).message}`);
    }
 
    // Resolved independently of the registration check above — even if
    // this fails for some reason, we still want to return whatever
    // registration status we found rather than failing the whole response.
    const punchedIn = await this.isCurrentlyPunchedIn(employeeId);
 
    return { registered, punchedIn };
  }
 
  // Backs the "Recent Punches" history slide. Deliberately capped at 10 —
  // this is a quick-glance list in a popup, not a full attendance report.
  async getRecentPunches(employeeId: string): Promise<RecentPunchesResult> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query(`
          SELECT TOP 10 PunchType, PunchTimestamp, PunchLocation
          FROM RawPunches
          WHERE EmployeeID = @EmployeeID
          ORDER BY PunchTimestamp DESC
        `);
 
      const punches: RecentPunch[] = (result.recordset ?? []).map((row) => ({
        action: row.PunchType === 60 ? 'IN' : 'OUT',
        time: new Date(row.PunchTimestamp).toISOString(),
        // Every row in RawPunches with CaptureSource = 2 came through this
        // same face-recognition flow — no other capture source writes
        // here yet, so this is safe to hardcode rather than look up.
        mode: 'Face Recognition',
        location: row.PunchLocation ?? null,
      }));
 
      return { punches };
    } catch (err) {
      this.logger.error(`getRecentPunches failed for ${employeeId} - ${(err as Error).message}`);
      return { punches: [] };
    }
  }
 
  // Backs the "Manage Face Registration" view.
  private static readonly ALL_ANGLES = ['front', 'right', 'left', 'up', 'down'];
 
  async getRegistrationStatus(employeeId: string): Promise<RegistrationStatusResult> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query(`
          SELECT AngleLabel, EnrolledDateTime
          FROM EmployeeFaceVectors
          WHERE EmployeeID = @EmployeeID AND IsActive = 1
          ORDER BY EnrolledDateTime DESC
        `);
 
      const rows = result.recordset ?? [];
      // Only counts labels that actually match a known angle name — rows
      // enrolled before AngleLabel existed have it as NULL, and correctly
      // don't count toward any specific angle (we genuinely don't know).
      //
      // FIX — deliberately NOT using [...new Set(...)] here: spreading a
      // Set can fail to infer as string[] (falls back to unknown[])
      // depending on the project's TS target/lib settings. A plain loop
      // sidesteps that whole class of config-dependent issue.
      const registeredAngles: string[] = [];
      for (const row of rows) {
        const label = row.AngleLabel as string | null;
        if (label && AttendanceService.ALL_ANGLES.includes(label) && !registeredAngles.includes(label)) {
          registeredAngles.push(label);
        }
      }
      const missingAngles = AttendanceService.ALL_ANGLES.filter((a) => !registeredAngles.includes(a));
 
      return {
        registered: rows.length > 0,
        totalActiveTemplates: rows.length,
        registeredAngles,
        missingAngles,
        lastUpdated: rows[0]?.EnrolledDateTime ? new Date(rows[0].EnrolledDateTime).toISOString() : null,
      };
    } catch (err) {
      this.logger.error(`getRegistrationStatus failed for ${employeeId} - ${(err as Error).message}`);
      return {
        registered: false,
        totalActiveTemplates: 0,
        registeredAngles: [],
        missingAngles: AttendanceService.ALL_ANGLES,
        lastUpdated: null,
      };
    }
  }
 
  // Same underlying data as determineNextPunchType, read the other way
  // around: if the last punch today was an IN (60), the employee is
  // currently punched in. No punches today at all, or last one was an
  // OUT (61), both mean punched out.
  private async isCurrentlyPunchedIn(employeeId: string): Promise<boolean> {
    const lastTypeCode = await this.getLastPunchTypeCodeToday(employeeId);
    return lastTypeCode === 60;
  }
 
  async punch(
    employeeId: string,
    frames: Express.Multer.File[],
    latitude?: number,
    longitude?: number,
    device?: string,
  ): Promise<PunchResult> {
    const verify = await this.verifyFace(employeeId, frames);
 
    if (verify.serviceUnavailable) {
      return {
        success: false,
        message: 'The attendance service is currently unavailable. Please try again in a moment, or contact IT if this continues.',
      };
    }
 
    if (verify.noVectorOnFile) {
      // No vector at all yet — nothing meaningful to log as a verification
      // attempt (there's no FaceVectorID to reference), so this one case
      // still doesn't call USP_RecordFaceVerificationPunch. Every other
      // outcome below does.
      return {
        success: false,
        message: "You haven't registered your face yet. Please register your face to use this feature.",
      };
    }
 
    // ClientLocationID is a cheap lookup off the employee's own record —
    // resolved regardless of whether verification succeeds, since it's
    // still meaningful context for the FaceVerificationAttempts audit row.
    const locationInfo = await this.resolveEmployeeLocation(employeeId);
 
    // GeoFenceID only resolves if the frontend actually sent coordinates
    // (geolocation can be denied/unavailable) AND we know the employee's
    // company. No match, or no coords at all, both just mean NULL.
    const geoFenceId =
      latitude !== undefined && longitude !== undefined && locationInfo
        ? await this.findMatchingGeoFence(locationInfo.companyId, latitude, longitude)
        : null;
 
    // SEAM — this is where "must be inside a fence to punch" plugs in once
    // GEOFENCE_REQUIRED flips to true. Right now it's a no-op.
    if (this.GEOFENCE_REQUIRED && geoFenceId === null) {
      await this.recordVerificationAttempt(
        employeeId,
        verify,
        null,
        latitude,
        longitude,
        geoFenceId,
        locationInfo?.branchId ?? null,
      );
      return {
        success: false,
        message: "You're outside an approved location for attendance. Please try again from an approved site.",
      };
    }
 
    // NEW — IN/OUT is now NestJS's job; USP_RecordFaceVerificationPunch no
    // longer determines this itself, it just records whatever we pass in.
    const punchType = verify.verified ? await this.determineNextPunchType(employeeId) : null;
 
    const recorded = await this.recordVerificationAttempt(
      employeeId,
      verify,
      punchType,
      latitude,
      longitude,
      geoFenceId,
      locationInfo?.branchId ?? null,
    );
 
    if (!verify.verified) {
      const message =
        verify.matchResult === 'LivenessFailed'
          ? "We couldn't confirm a live face — please look directly at the camera and blink naturally, then try again."
          : "Face didn't match. Please try again, or contact HR if this keeps happening.";
      return { success: false, message };
    }
 
    if (!recorded.ok) {
      return { success: false, message: 'Could not record the punch. Please try again.' };
    }
 
    // Fire-and-forget — deliberately NOT awaited. The employee gets their
    // success response immediately; the human-readable address fills in
    // on the RawPunches row a moment later, in the background. See
    // resolvePunchLocationInBackground() for why this is safe to skip
    // entirely (no coords, or the lookup just fails).
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
 
  // Moved from the old stored procedure into NestJS, since
  // USP_RecordFaceVerificationPunch just accepts whatever @PunchType it's
  // given now, rather than figuring it out itself.
  // RawPunches.PunchType is a real INT column referencing a lookup table
  // (confirmed with the TL: IN = 60, OUT = 61) — NOT free text. The
  // stored procedure's @PunchType parameter is NVARCHAR(10), but SQL
  // Server can only auto-convert a NUMERIC-looking string ('60') into
  // that INT column, not a word ('IN'). So internally we still work with
  // 'IN'/'OUT' for readability, and only convert to the numeric code at
  // the exact point of calling the database.
  private static readonly PUNCH_TYPE_CODE: Record<'IN' | 'OUT', string> = {
    IN: '60',
    OUT: '61',
  };
 
  private async determineNextPunchType(employeeId: string): Promise<'IN' | 'OUT'> {
    const lastTypeCode = await this.getLastPunchTypeCodeToday(employeeId);
    return lastTypeCode === 60 ? 'OUT' : 'IN';
  }
 
  // Shared source of truth for "what was this employee's most recent
  // punch today" — used both to decide the NEXT punch type (above) and
  // to answer "are they currently punched in" (below, for face-status).
  // Returns the raw numeric code (60/61) or null if no punches today.
  private async getLastPunchTypeCodeToday(employeeId: string): Promise<number | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query(`
          SELECT TOP 1 PunchType
          FROM RawPunches
          WHERE EmployeeID = @EmployeeID AND CAST(PunchTimestamp AS DATE) = CAST(GETDATE() AS DATE)
          ORDER BY PunchTimestamp DESC
        `);
      return result.recordset?.[0]?.PunchType ?? null;
    } catch (err) {
      this.logger.error(`getLastPunchTypeCodeToday failed for ${employeeId} - ${(err as Error).message}`);
      return null;
    }
  }
 
  private async verifyFace(employeeId: string, frames: Express.Multer.File[]): Promise<FaceVerifyResult> {
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
      // TEMPORARY DEBUG — error.message alone was coming back blank in
      // production logs, giving no clue what actually failed. Logging the
      // full shape (code, message, and the Python service's own response
      // status/body if one came back at all) to find the real cause.
      this.logger.error(
        `Face-verify service call failed - code: ${error.code}, message: ${error.message}, ` +
        `responseStatus: ${error.response?.status}, responseData: ${JSON.stringify(error.response?.data)}`,
      );
      const isServiceDown =
        error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND';
      return { verified: false, serviceUnavailable: isServiceDown };
    }
  }
 
  // Calls the NEW procedure — logs every attempt (matched or not) to
  // FaceVerificationAttempts, and only creates a RawPunches row when
  // punchType is non-null (i.e. verification actually succeeded).
  private async recordVerificationAttempt(
    claimedEmployeeId: string,
    verify: FaceVerifyResult,
    punchType: 'IN' | 'OUT' | null,
    latitude?: number,
    longitude?: number,
    geoFenceId?: number | null,
    clientLocationId?: number | null,
  ): Promise<{ ok: boolean }> {
    try {
      const pool = await this.databaseService.connect();
      await pool.request()
        .input('ClaimedEmployeeID', sql.VarChar(25), claimedEmployeeId)
        .input('MatchedEmployeeID', sql.VarChar(25), verify.verified ? claimedEmployeeId : null)
        .input('FaceVectorID', sql.Int, verify.matchedFaceVectorId ?? null) // now reported by /verify's gallery matching
        .input('DeviceID', sql.Int, this.ESS_DEVICE_ID) // BiometricDevices ID 4 — confirmed ESS row
        .input('ConfidenceScore', sql.Decimal(5, 2), verify.confidenceScore ?? 0)
        .input('ThresholdUsed', sql.Decimal(5, 2), verify.thresholdUsed ?? 0)
        .input('ModelVersionUsed', sql.NVarChar(30), 'dlib-face-recognition-v1')
        .input('LivenessCheckPassed', sql.Bit, verify.livenessCheckPassed ?? false)
        .input('MatchResult', sql.NVarChar(20), verify.matchResult ?? 'Error')
        .input('CapturedImagePath', sql.NVarChar(500), null)
        .input('PunchType', sql.NVarChar(10), punchType ? AttendanceService.PUNCH_TYPE_CODE[punchType] : null)
        .input('Latitude', sql.Decimal(9, 6), latitude ?? null)
        .input('Longitude', sql.Decimal(9, 6), longitude ?? null)
        .input('GeoFenceID', sql.Int, geoFenceId ?? null)
        .input('ClientLocationID', sql.Int, clientLocationId ?? null)
        // NEW — @PunchLocation has no default in the proc now, so it must
        // always be explicitly supplied. NULL here is correct and
        // expected: the real address isn't known yet at insert time (it's
        // resolved afterward by resolvePunchLocationInBackground).
        .input('PunchLocation', sql.VarChar(sql.MAX), null)
        .execute('USP_RecordFaceVerificationPunch');
      return { ok: true };
    } catch (err) {
      this.logger.error(`recordVerificationAttempt failed for ${claimedEmployeeId} - ${(err as Error).message}`);
      return { ok: false };
    }
  }
 
  // ── PunchLocation (human-readable address) ─────────────────────────────
  // Filled in via USP_UpdatePunchLocation, a small dedicated proc — kept
  // separate from USP_RecordFaceVerificationPunch since this update
  // happens moments LATER, after an external geocoding call completes,
  // not at insert time. That external call shouldn't be allowed to hold
  // up or fail the actual punch record.
 
  // Entry point — called from punch() WITHOUT await. Everything in here
  // runs after the employee already has their response; if any step
  // fails or is skipped, the punch itself is completely unaffected.
  private resolvePunchLocationInBackground(employeeId: string, latitude: number, longitude: number): void {
    void (async () => {
      const rawPunchId = await this.getLatestRawPunchId(employeeId);
      if (!rawPunchId) return;
 
      const locationText = await this.reverseGeocode(latitude, longitude);
      if (!locationText) return; // Nominatim failed/timed out — PunchLocation just stays NULL
 
      await this.updatePunchLocation(rawPunchId, locationText);
    })().catch((err) => {
      this.logger.error(`resolvePunchLocationInBackground failed for ${employeeId} - ${(err as Error).message}`);
    });
  }
 
  // Free, no API key — OpenStreetMap's Nominatim. Their usage policy caps
  // this at ~1 request/second and requires a real identifying User-Agent
  // (a generic/default one can get silently blocked). Fine at our current
  // volume; if punch volume grows a lot, this is the first thing to
  // revisit (e.g. self-hosting Nominatim, or switching to a paid provider).
  private async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.http.get('https://nominatim.openstreetmap.org/reverse', {
          params: { format: 'jsonv2', lat: latitude, lon: longitude },
          headers: {
            'User-Agent': 'KTS-People360-Attendance/1.0 (internal HRMS attendance system)',
          },
          timeout: 5000,
        }),
      );
      return response.data?.display_name ?? null;
    } catch (err) {
      this.logger.error(`reverseGeocode failed for (${latitude}, ${longitude}) - ${(err as Error).message}`);
      return null;
    }
  }
 
  // Captured right before the geocoding call (not after), so a second,
  // fast punch by the same employee in the meantime can't cause this
  // background job to update the wrong row.
  private async getLatestRawPunchId(employeeId: string): Promise<number | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query('SELECT TOP 1 ID FROM RawPunches WHERE EmployeeID = @EmployeeID ORDER BY ID DESC');
      return result.recordset?.[0]?.ID ?? null;
    } catch (err) {
      this.logger.error(`getLatestRawPunchId failed for ${employeeId} - ${(err as Error).message}`);
      return null;
    }
  }
 
  // FIX — was a direct UPDATE, which failed with "UPDATE permission was
  // denied on the object 'RawPunches'" (this app's SQL login only has
  // EXECUTE rights on stored procs, not raw table writes — same pattern
  // as every other write in this project). Now goes through the TL's new
  // USP_UpdatePunchLocation instead, consistent with that convention.
  private async updatePunchLocation(rawPunchId: number, locationText: string): Promise<void> {
    try {
      const pool = await this.databaseService.connect();
      await pool.request()
        .input('RawPunchID', sql.BigInt, rawPunchId)
        .input('PunchLocation', sql.VarChar(sql.MAX), locationText)
        .execute('USP_UpdatePunchLocation');
    } catch (err) {
      this.logger.error(`updatePunchLocation failed for RawPunches ID ${rawPunchId} - ${(err as Error).message}`);
    }
  }
 
  // ClientLocationID → CompanyBranches.BranchID (confirmed FK). Employee
  // already carries BranchID directly, so this is a single cheap lookup —
  // no geolocation involved at all.
  private async resolveEmployeeLocation(employeeId: string): Promise<EmployeeLocationInfo | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .query('SELECT CompanyID, BranchID FROM Employee WHERE EmployeeID = @EmployeeID');
      const row = result.recordset?.[0];
      if (!row) return null;
      return { companyId: row.CompanyID, branchId: row.BranchID ?? null };
    } catch (err) {
      this.logger.error(`resolveEmployeeLocation failed for ${employeeId} - ${(err as Error).message}`);
      return null;
    }
  }
 
  // GeoFences is radius-based: a center Latitude/Longitude + RadiusMeters
  // per fence, scoped by CompanyID. Pulls all active fences for the
  // employee's company, computes haversine distance to each, and returns
  // the nearest fence the punch actually falls inside — or null if none.
  private async findMatchingGeoFence(
    companyId: number,
    latitude: number,
    longitude: number,
  ): Promise<number | null> {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request()
        .input('CompanyID', sql.Int, companyId)
        .query(`
          SELECT ID, Latitude, Longitude, RadiusMeters
          FROM GeoFences
          WHERE CompanyID = @CompanyID AND IsActive = 1
        `);
 
      let closestId: number | null = null;
      let closestDistance = Infinity;
 
      for (const fence of result.recordset ?? []) {
        if (fence.RadiusMeters == null) continue; // no radius defined — can't evaluate, skip
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
      this.logger.error(`findMatchingGeoFence failed for company ${companyId} - ${(err as Error).message}`);
      return null;
    }
  }
 
  // Standard haversine great-circle distance, in meters.
  private static haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
 
  // ── ENROLLMENT — GALLERY approach ───────────────────────────────────────
  // Python's /enroll no longer blends captures into one average — it
  // returns each PASSING capture as its own separate template. Every
  // template gets saved as its own row: deactivate the whole old gallery
  // ONCE first, then insert each new template without deactivating
  // between inserts (that's exactly what the SP change was for).
  async enrollFace(employeeId: string, frames: Express.Multer.File[]): Promise<EnrollResult> {
    const computed = await this.computeFaceVectors(frames);
 
    if (computed.serviceUnavailable) {
      return { success: false, message: 'The attendance service is currently unavailable. Please try again in a moment.' };
    }
    if (!computed.success || !computed.vectors || computed.vectors.length === 0) {
      return {
        success: false,
        message: computed.message ?? "Couldn't register your face clearly. Please try again in good lighting, facing the camera directly.",
      };
    }
 
    try {
      const pool = await this.databaseService.connect();
 
      // Deactivate the whole existing gallery ONCE, before any new
      // templates are inserted — not per-template, which would be
      // pointless (the new SP no longer deactivates on insert anyway)
      // and was exactly the bug this whole change avoids.
      await pool.request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('Reason', sql.NVarChar(100), 'Superseded by new enrollment')
        .execute('USP_DeactivateEmployeeFaceVectors');
 
      let savedCount = 0;
      for (const { angleLabel, vectorBase64 } of computed.vectors) {
        const vectorBuffer = Buffer.from(vectorBase64, 'base64');
        const request = pool.request()
          .input('EmployeeID', sql.VarChar(25), employeeId)
          .input('FaceVector', sql.VarBinary(sql.MAX), vectorBuffer)
          .input('VectorDimension', sql.SmallInt, computed.vectorDimension)
          .input('ModelVersion', sql.NVarChar(30), computed.modelVersion)
          .input('EnrolledBy', sql.VarChar(25), employeeId)
          .input('Reason', sql.NVarChar(100), 'Initial enrollment');
 
        // See ANGLE_LABEL_COLUMN_READY above — only send this once the
        // DB side genuinely supports it.
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
        return { success: false, message: 'Could not register your face. Please try again.' };
      }
 
      return {
        success: true,
        message: `Face registered successfully (${savedCount} angle${savedCount === 1 ? '' : 's'} saved). You can now use it to punch in and out.`,
      };
    } catch (err) {
      this.logger.error(`enrollFace failed for ${employeeId} - ${(err as Error).message}`);
      return { success: false, message: 'Could not register your face. Please try again.' };
    }
  }
 
  // Thin proxy to Python's lightweight single-frame check — no DB
  // involvement at all, purely for immediate UI feedback during
  // enrollment. The real save still only happens via enrollFace() above.
  async checkEnrollmentFrame(frame: Express.Multer.File): Promise<{
    passed: boolean; reason?: string | null; message: string;
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
          timeout: 8000, // short — this must feel instant, it's a live feedback check
        }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(`checkEnrollmentFrame failed - ${(err as Error).message}`);
      // Fails open — a failed quality CHECK should never block the
      // employee from proceeding, since the real validation still
      // happens at final submission in enrollFace().
      return { passed: true, message: '' };
    }
  }
 
  private async computeFaceVectors(frames: Express.Multer.File[]): Promise<{
    success: boolean;
    vectors?: { angleLabel: string | null; vectorBase64: string }[];
    vectorDimension?: number; modelVersion?: string;
    message?: string; serviceUnavailable?: boolean;
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
        this.http.post(`${PYTHON_ATTENDANCE_URL}/enroll`, form, { headers: form.getHeaders(), timeout: 20000 }),
      );
      return response.data;
    } catch (err) {
      const error = err as { code?: string; message?: string };
      this.logger.error(`Face-enroll compute call failed: ${error.message}`);
      const isServiceDown =
        error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND';
      return { success: false, serviceUnavailable: isServiceDown };
    }
  }
}
 
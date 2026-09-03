import {
  Controller,
  Post,
  Get,
  Req,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
 
// Sent alongside the frame files as ordinary multipart text fields (not
// JSON) — the frontend appends these to the same FormData as the frames.
// Both optional: geolocation can be denied/unavailable, and the punch
// should still succeed without it (GeoFenceID just stays NULL in that case).
interface PunchLocationBody {
  latitude?: string;
  longitude?: string;
}
 
// Small, dependency-free parse — just enough to produce a friendly
// "Chrome, Windows" label for the punch details card. Not meant to be a
// complete/precise UA parser (that'd normally mean pulling in a library
// just for this one cosmetic label), so it's deliberately best-effort:
// falls back to "Unknown" for anything it doesn't recognize rather than
// guessing wrong.
function parseDeviceLabel(userAgent: string | undefined): string {
  if (!userAgent) return 'Unknown device';
 
  let browser = 'Unknown browser';
  if (userAgent.includes('Edg/')) browser = 'Edge';
  else if (userAgent.includes('Chrome/')) browser = 'Chrome';
  else if (userAgent.includes('Firefox/')) browser = 'Firefox';
  else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) browser = 'Safari';
 
  let os = 'Unknown OS';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS X')) os = 'macOS';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
 
  return `${browser}, ${os}`;
}
 
@Controller('employee/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
 
  // Checked by the frontend BEFORE it opens the camera for a punch — tells
  // the dashboard whether the logged-in employee has an active face vector
  // at all, so it can offer "Register your face" instead of a camera flow
  // that's guaranteed to fail.
  @UseGuards(JwtAuthGuard)
  @Get('face-status')
  async faceStatus(@Req() req: any) {
    const employeeId = req.user.employeeId;
    return this.attendanceService.checkFaceRegistered(employeeId);
  }
 
  // 1-to-1 check against the LOGGED-IN employee's own vector — employeeId
  // comes from the JWT, never guessed from the photo itself.
  @UseGuards(JwtAuthGuard)
  @Post('punch')
  @UseInterceptors(FilesInterceptor('frames', 30))
  async punch(
    @Req() req: any,
    @UploadedFiles() frames: Express.Multer.File[],
    @Body() body: PunchLocationBody,
  ) {
    if (!frames || frames.length === 0) {
      throw new BadRequestException('At least one frame is required to punch in or out.');
    }
    const employeeId = req.user.employeeId;
 
    // Parse defensively — malformed/missing values just fall through as
    // undefined rather than blocking the punch. Location is a nice-to-have
    // enrichment right now, not a requirement (see GEOFENCE_REQUIRED note
    // in attendance.service.ts for when that changes).
    const latitude = body.latitude !== undefined ? Number(body.latitude) : undefined;
    const longitude = body.longitude !== undefined ? Number(body.longitude) : undefined;
    const hasValidCoords =
      latitude !== undefined && longitude !== undefined && !Number.isNaN(latitude) && !Number.isNaN(longitude);
 
    const device = parseDeviceLabel(req.headers['user-agent']);
 
    return this.attendanceService.punch(
      employeeId,
      frames,
      hasValidCoords ? latitude : undefined,
      hasValidCoords ? longitude : undefined,
      device,
    );
  }
 
  // Read-only history for the "Recent Punches" slide — most recent first,
  // capped at a sane count since this is a quick-glance UI list, not a
  // full attendance report.
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async recentPunches(@Req() req: any) {
    const employeeId = req.user.employeeId;
    return this.attendanceService.getRecentPunches(employeeId);
  }
 
  // Backs the "Manage Face Registration" view — which angles are
  // actually on file, and when they were last updated.
  @UseGuards(JwtAuthGuard)
  @Get('registration-status')
  async registrationStatus(@Req() req: any) {
    const employeeId = req.user.employeeId;
    return this.attendanceService.getRegistrationStatus(employeeId);
  }
 
  // REMOVED — today-summary endpoint. That data now comes from the
  // dashboard's GET /employee/dashboard/profile instead (USP_GetUserInfo
  // merges it in directly) — see employee-dashboard.service.ts.
 
  // Live, per-step quality feedback during enrollment — fires once per
  // captured angle, BEFORE the real /enroll submission at the end. Not
  // the source of truth (see attendance.service.ts) — purely so the
  // employee finds out immediately if one angle came out blurry, instead
  // of only after finishing all 5 steps.
  @UseGuards(JwtAuthGuard)
  @Post('enroll/check-frame')
  @UseInterceptors(FileInterceptor('frame'))
  async checkEnrollmentFrame(@UploadedFile() frame: Express.Multer.File) {
    if (!frame) {
      throw new BadRequestException('A photo is required to check.');
    }
    return this.attendanceService.checkEnrollmentFrame(frame);
  }
 
  // Self-service enrollment — always enrolls whoever is currently logged
  // in. There is no "enroll someone else" path; HR is never involved.
  @UseGuards(JwtAuthGuard)
  @Post('enroll')
  @UseInterceptors(FilesInterceptor('frames', 30))
  async enroll(@Req() req: any, @UploadedFiles() frames: Express.Multer.File[]) {
    if (!frames || frames.length === 0) {
      throw new BadRequestException('At least one photo is required to register your face.');
    }
    const employeeId = req.user.employeeId;
    return this.attendanceService.enrollFace(employeeId, frames);
  }
}
 
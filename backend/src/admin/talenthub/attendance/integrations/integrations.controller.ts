import {
  Controller,
  Get,
  UseGuards,Body, Post
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { IntegrationsService } from './integrations.service';
import { AttendanceIntegrationDto } from './dto/attendance-integration.dto';
import { ReconcileLeaveUpdateDto } from './dto/reconcile-leave-update.dto';


@Controller('admin/ta/attendance/integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
  ) {}

  // ==========================================
  // Settings
  // ==========================================

  @Get('settings/descriptions')
  async getDescriptions() {
    return this.integrationsService.getDescriptions();
  }
  // ==========================================
// Attendance Integration Types
// ==========================================

@Get('settings/integrationtypes')
async getIntegrationTypes() {
  return this.integrationsService.getIntegrationTypes();
}
// ==========================================
// Applicable Attendance
// ==========================================

@Get('settings/applicableattendance')
async getApplicableAttendance() {
  return this.integrationsService.getApplicableAttendance();
}

// ==========================================
// Leave Abbreviations
// ==========================================

@Get('settings/leaveabbreviations')
async getLeaveAbbreviations() {
  return this.integrationsService.getLeaveAbbreviations();
}

// ==========================================
// Calculate OT
// ==========================================

@Get('settings/calculateot')
async getCalculateOT() {
  return this.integrationsService.getCalculateOT();
}
// ==========================================
// Save Attendance Integration
// ==========================================

@Post('settings/save')
async saveAttendanceIntegration(
  @Body() dto: AttendanceIntegrationDto,
) {
  return this.integrationsService.saveAttendanceIntegration(dto);
}
// ==========================================
// Attendance Integration 
// ==========================================
//- Descriptions
@Get('attendanceintegration/descriptions')
async getAttendanceIntegrationDescriptions() {
  return this.integrationsService.getAttendanceIntegrationDescriptions();
}
// ==========================================
// Reconcile Leave - Leave Types
// ==========================================
//- Leave Types
@Get('reconcileleave/leavetypes')
async getReconcileLeaveTypes() {
  return this.integrationsService.getReconcileLeaveTypes();
}
//- Update

@Post('reconcileleave/update')
async updateReconcileLeave(
  @Body() dto: ReconcileLeaveUpdateDto,
) {
  return this.integrationsService.updateReconcileLeave(
    dto,
  );
}
}
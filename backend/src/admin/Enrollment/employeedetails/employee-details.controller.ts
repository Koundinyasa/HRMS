import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { EmployeeDetailsService } from './employee-details.service';

@Controller('onboard/employee-details')
export class EmployeeDetailsController {
  constructor(
    private readonly employeeDetailsService: EmployeeDetailsService,
  ) {}

  // ================= Employee =================

  @Get('employee')
  getEmployee(@Req() req: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.getEmployee(employeeId);
  }

  @Post('employee')
  saveEmployee(@Req() req: any, @Body() body: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.saveEmployee(employeeId, body);
  }

  // ================= Profile =================

  @Get('profile')
  getProfile(@Req() req: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.getProfile(employeeId);
  }

  @Post('profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.updateProfile(employeeId, body);
  }

  // ================= Classification =================

  @Get('classification')
  getClassification(@Req() req: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.getClassification(employeeId);
  }

  @Post('classification')
  saveClassification(@Req() req: any, @Body() body: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.saveClassification(
      employeeId,
      body,
    );
  }

  // ================= Documents =================

  @Get('documents')
  getDocuments(@Req() req: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.getDocuments(employeeId);
  }

  @Post('documents/upload')
  uploadDocument(@Req() req: any, @Body() body: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.uploadDocument(employeeId, body);
  }

  @Delete('documents/:documentId')
  deleteDocument(@Param('documentId') documentId: string) {
    return this.employeeDetailsService.deleteDocument(documentId);
  }

  // ================= Employee Group =================

  @Get('employee-group')
  getGroup(@Req() req: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.getGroup(employeeId);
  }

  @Post('employee-group')
  saveGroup(@Req() req: any, @Body() body: any) {
    const employeeId = req.user?.employeeId || 1;
    return this.employeeDetailsService.saveGroup(employeeId, body);
  }

  // ================= Organization Chart =================

  @Get('organization-chart')
  getOrganizationChart() {
    return this.employeeDetailsService.getOrganizationChart();
  }
}
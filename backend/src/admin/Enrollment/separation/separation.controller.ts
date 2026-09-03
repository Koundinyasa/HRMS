import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { SeparationService } from './separation.service';

@Controller('separation')
export class SeparationController {
  constructor(private readonly separationService: SeparationService) {}

  // ================= Dashboard =================

  @Get('dashboard')
  getDashboard() {
    return this.separationService.getDashboard();
  }

  // ================= Exit Module =================

  @Get('exit-module/employees')
  getEmployees() {
    return this.separationService.getEmployees();
  }

  @Post('exit-module/employees')
  addEmployee(@Body() body: any) {
    return this.separationService.addEmployee(body);
  }

  @Put('exit-module/employees/:employeeId')
  updateEmployee(
    @Param('employeeId') employeeId: string,
    @Body() body: any,
  ) {
    return this.separationService.updateEmployee(employeeId, body);
  }

  @Get('exit-module/offboarded-employees')
  getOffboardedEmployees() {
    return this.separationService.getOffboardedEmployees();
  }

  @Get('exit-module/settings')
  getSettings() {
    return this.separationService.getSettings();
  }

  @Post('exit-module/settings')
  createPolicy(@Body() body: any) {
    return this.separationService.createPolicy(body);
  }

  @Put('exit-module/settings/:policyId')
  updatePolicy(
    @Param('policyId') policyId: string,
    @Body() body: any,
  ) {
    return this.separationService.updatePolicy(policyId, body);
  }

  @Get('exit-module/interview-summary')
  getInterviewSummary() {
    return this.separationService.getInterviewSummary();
  }

  // ================= Full Final Settlement =================

  @Get('full-final-settlement/pending')
  getPendingFFS() {
    return this.separationService.getPendingFFS();
  }

  @Post('full-final-settlement/pending')
  savePendingFFS(@Body() body: any) {
    return this.separationService.savePendingFFS(body);
  }

  @Get('full-final-settlement/summary')
  getFFSSummary() {
    return this.separationService.getFFSSummary();
  }

  @Get('full-final-settlement/import')
  getImportData() {
    return this.separationService.getImportData();
  }

  @Post('full-final-settlement/import')
  importData(@Body() body: any) {
    return this.separationService.importData(body);
  }

  @Get('full-final-settlement/report')
  getReport() {
    return this.separationService.getReport();
  }
}
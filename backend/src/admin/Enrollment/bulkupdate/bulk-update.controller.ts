import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { BulkUpdateService } from './bulk-update.service';

@Controller('onboard/bulk-update')
export class BulkUpdateController {
  constructor(private readonly bulkUpdateService: BulkUpdateService) {}

  // Role
  @Get('role')
  getRoles() {
    return this.bulkUpdateService.getRoles();
  }

  @Put('role')
  updateRoles(@Body() body: any) {
    return this.bulkUpdateService.updateRoles(body);
  }

  // PAN Verification
  @Get('pan-verification')
  getPanVerification() {
    return this.bulkUpdateService.getPanVerification();
  }

  @Post('pan-verification/verify')
  verifyPan(@Body() body: any) {
    return this.bulkUpdateService.verifyPan(body);
  }

  @Get('pan-verification/status')
  getPanStatus() {
    return this.bulkUpdateService.getPanStatus();
  }

  // Statutory
  @Get('statutory')
  getStatutory() {
    return this.bulkUpdateService.getStatutory();
  }

  @Put('statutory')
  updateStatutory(@Body() body: any) {
    return this.bulkUpdateService.updateStatutory(body);
  }

  // Classification
  @Get('classification')
  getClassification() {
    return this.bulkUpdateService.getClassification();
  }

  @Put('classification')
  updateClassification(@Body() body: any) {
    return this.bulkUpdateService.updateClassification(body);
  }

  // Authority
  @Get('authority')
  getAuthority() {
    return this.bulkUpdateService.getAuthority();
  }

  @Put('authority')
  updateAuthority(@Body() body: any) {
    return this.bulkUpdateService.updateAuthority(body);
  }
}

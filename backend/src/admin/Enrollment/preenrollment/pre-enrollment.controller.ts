import {Controller,Get,Post,Put,Param,Body} from '@nestjs/common';
import { PreEnrollmentService } from './pre-enrollment.service';

@Controller('pre-enrollment')
export class PreEnrollmentController {
  constructor(
    private readonly preEnrollmentService: PreEnrollmentService,
  ) {}

  // ================= Dashboard =================

  @Get('dashboard')
  getDashboard() {
    return this.preEnrollmentService.getDashboard();
  }

  // ================= Candidate =================

  @Get('candidate')
  getCandidates() {
    return this.preEnrollmentService.getCandidates();
  }

  @Post('candidate')
  createCandidate(@Body() body: any) {
    return this.preEnrollmentService.createCandidate(body);
  }

  @Put('candidate/:candidateId')
  updateCandidate(
    @Param('candidateId') candidateId: string,
    @Body() body: any,
  ) {
    return this.preEnrollmentService.updateCandidate(candidateId, body);
  }

  // ================= Completed Candidate =================

  @Get('completed-candidate')
  getCompletedCandidates() {
    return this.preEnrollmentService.getCompletedCandidates();
  }

  // ================= Offboard =================

  @Get('offboard')
  getOffboardCandidates() {
    return this.preEnrollmentService.getOffboardCandidates();
  }

  @Post('offboard')
  createOffboard(@Body() body: any) {
    return this.preEnrollmentService.createOffboard(body);
  }

  @Put('offboard/:candidateId')
  updateOffboard(
    @Param('candidateId') candidateId: string,
    @Body() body: any,
  ) {
    return this.preEnrollmentService.updateOffboard(candidateId, body);
  }

  // ================= Settings =================

  @Get('settings')
  getSettings() {
    return this.preEnrollmentService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() body: any) {
    return this.preEnrollmentService.updateSettings(body);
  }

  // ================= Import =================

  @Get('import')
  getImportHistory() {
    return this.preEnrollmentService.getImportHistory();
  }

  @Post('import')
  importCandidates(@Body() body: any) {
    return this.preEnrollmentService.importCandidates(body);
  }
}
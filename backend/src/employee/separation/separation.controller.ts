import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
} from '@nestjs/common';

import { SeparationService } from './separation.service';
import { SubmitResignationDto } from './dto/submit-resignation.dto';
import { UpdateSeparationApprovalDto } from './dto/update-separation-approval.dto';
import { RelieveEmployeeDto } from './dto/relieve-employee.dto';
import { WithdrawResignationDto } from './dto/withdraw-resignation.dto';

@Controller('employee/separation')
export class SeparationController {
  constructor(private readonly separationService: SeparationService) {}

  @Post('resignation')
  submitResignation(@Req() req, @Body() body: SubmitResignationDto) {
    return this.separationService.submitResignation(
      req.user.employeeId,
      body.requestedLastWorkingDate,
      body.reason,
    );
  }
  @Post('approval')
  updateApproval(@Req() req, @Body() body: UpdateSeparationApprovalDto) {
    return this.separationService.updateApproval(
      body.resignationId,
      req.user.employeeId,
      body.stageOrder,
      body.actionStatus,
      body.remarks,
      body.isExitInterviewCompleted,
    );
  }
  @Post('relieve')
  relieveEmployee(@Req() req, @Body() body: RelieveEmployeeDto) {
    return this.separationService.relieveEmployee(
      body.resignationId,
      req.user.employeeId,
      body.relievingLetterIssued,
      body.experienceLetterIssued,
      body.remarks,
    );
  }
  @Post('withdraw')
  withdrawResignation(@Req() req, @Body() body: WithdrawResignationDto) {
    return this.separationService.withdrawResignation(
      body.resignationId,
      req.user.employeeId,
      body.withdrawalReason,
    );
  }
  @Get('approvals')
  getApprovalList(@Req() req) {
    return this.separationService.getApprovalList(req.user.employeeId);
  }
  @Get('status')
  getDetails(@Req() req) {
    return this.separationService.getResignationDetails(req.user.employeeId);
  }
}

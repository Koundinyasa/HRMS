import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { LeaveService } from './leave.service';
import { LeaveRequestDto } from './dto/leave-request.dto';
import { HierarchicalLeaveActionDto } from './dto/hierarchical-leave-action.dto';
import { WithdrawCancelDto } from './dto/withdraw-cancel.dto'; // NEW IMPORT
import { HrLeaveRequestDto } from './dto/hr-leave-request.dto';
import { PendingLeaveRequestDto } from './dto/pending-leave-request.dto';
@Controller('employee/leave')
export class LeaveController {
  constructor(
    private readonly leaveService: LeaveService,
  ) {}

  // Leave Types
  @Get('leavetypes')
  async getLeaveTypes() {
    return this.leaveService.getLeaveTypes();
  }

  // Holiday List
  @Get('holidaylist')
  async getHolidayList() {
    return this.leaveService.getHolidayList();
  }

  // Employee Leave Balance
  @Get('balance')
@UseGuards(JwtAuthGuard)
async getEmployeeLeaveBalance(@Req() req) {
  return this.leaveService.getEmployeeLeaveBalance(
    req.user.employeeId,
  );
}

  // Leave History
  @Get('history')
@UseGuards(JwtAuthGuard)
async getLeaveHistory(@Req() req) {
  return this.leaveService.getLeaveHistory(
    req.user.employeeId,
  );
}

  // Leave Status
  @Get('status')
@UseGuards(JwtAuthGuard)
async getLeaveStatus(@Req() req) {
  return this.leaveService.getLeaveStatus(
    req.user.employeeId,
  );
}

  // Apply Leave
@UseGuards(JwtAuthGuard)
@Post('apply')
@UseInterceptors(
  FileInterceptor('document', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const employeeId = (req as any).user.employeeId;


        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          employeeId,
        );

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, {
            recursive: true,
          });
        }

        cb(null, uploadPath);
      },

      filename: (req, file, cb) => {
        const uniqueFileName =
          `${uuid()}${extname(file.originalname)}`;

        cb(null, uniqueFileName);
      },
    }),
  }),
)
async applyLeave(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: LeaveRequestDto,
) {

  const employeeId = req.user.employeeId;
  const createdBy = req.user.createdBy;

  const documentPath = file
    ? `${employeeId}/${file.filename}`
    : undefined;

  return this.leaveService.applyLeave(
    employeeId,
    createdBy,
    Number(body.leaveTypeId),
    body.fromDate,
    body.toDate,
    body.sessionFrom,
    body.sessionTo,
    String(body.isHalfDay).toLowerCase() === 'true',
    body.reason,
    documentPath,
  );
}
  // HR Apply Leave
@UseGuards(JwtAuthGuard)
@Post('applyhr')
@UseInterceptors(
  FileInterceptor('document', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const employeeId = (req as any).user.employeeId;

        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          employeeId,
        );

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },

      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }),
)
async hrApplyLeave(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: HrLeaveRequestDto,
) {
  const employeeId = body.employeeId;   
  const createdBy = req.user.createdBy; 
  const documentPath = file
    ? `${employeeId}/${file.filename}`
    : undefined;

  return this.leaveService.hrApplyLeave(
  employeeId,
  createdBy,
  Number(body.leaveTypeId),
  body.fromDate,
  body.toDate,
  body.sessionFrom,
  body.sessionTo,
  body.isHalfDay,
  body.reason,
  documentPath,
  body.isHRForceApply,
);
}
  // Approval / Rejection
  @UseGuards(JwtAuthGuard)
@Post('approval')
async hierarchicalLeaveAction(
  @Req() req,
  @Body() body: HierarchicalLeaveActionDto,
) {
  return this.leaveService.hierarchicalLeaveAction(
    body.approvalId,
    req.user.employeeId,
    body.actionStatusId,
    body.remarks,
  );
}

  // Withdraw / Cancel Leave  <-- NEW API
  @UseGuards(JwtAuthGuard)
@Post('withdrawcancel')
async withdrawCancelLeave(
  @Req() req,
  @Body() body: WithdrawCancelDto,
) {
  return this.leaveService.withdrawCancelLeave(
    req.user.employeeId,
    req.user.createdBy,
    body.leaveApplicationId,
    body.actionId,
    body.reason,
  );
}

// Pending Leave Requests
@Get('pending')
@UseGuards(JwtAuthGuard)
async getPendingLeaveRequests(@Req() req) {
  return this.leaveService.getPendingLeaveRequests(
    req.user.employeeId,
  );
}

  // Upload Holiday Excel
  @Post('holidaysupload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadHolidayFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.leaveService.uploadHolidayFile(file);
  }

  @Get('reporting-employees')
@UseGuards(JwtAuthGuard)
async getReportingManagerEmployeeList(
  @Req() req,
) {
  return this.leaveService
    .getReportingManagerEmployeeList(
      req.user.createdBy,
    );
}
@Get('employee-details')
@UseGuards(JwtAuthGuard)
async getEmployeeLeaveDetails(
  @Query('employeeId') employeeId: string,
) {
  return this.leaveService.getEmployeeLeaveDetails(
    employeeId,
  );
}
  
}



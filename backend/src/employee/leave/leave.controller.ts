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
  Param,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { Roles } from '../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../common/constants/roles';
import { EmployeeScopeService } from '../../common/scope/employee-scope.service';

import { LeaveService } from './leave.service';
import { LeaveRequestDto } from './dto/leave-request.dto';
import { HierarchicalLeaveActionDto } from './dto/hierarchical-leave-action.dto';
import { WithdrawCancelDto } from './dto/withdraw-cancel.dto'; // NEW IMPORT
import { HrLeaveRequestDto } from './dto/hr-leave-request.dto';
@Controller('employee/leave')
export class LeaveController {
  constructor(
    private readonly leaveService: LeaveService,
    private readonly scope: EmployeeScopeService,
  ) {}

  // Leave Types
  @Get('leavetypes')
  async getLeaveTypes(
    @Req() req: any,
    @Query('employeeId') employeeId?: string,
  ) {
    const ownEmployeeId = String(req.user?.employeeId ?? '').trim();
    const requestedEmployeeId = employeeId?.trim();
    const targetEmployeeId = requestedEmployeeId || ownEmployeeId;

    // Looking up someone else's leave types needs access to that employee.
    if (requestedEmployeeId && requestedEmployeeId !== ownEmployeeId) {
      await this.scope.assertCanAccess(req.user, requestedEmployeeId);
    }

    const companyId = Number(req.user?.companyId);

    if (!targetEmployeeId) {
      throw new BadRequestException('Invalid employeeId');
    }

    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new BadRequestException('Invalid companyId');
    }

    return this.leaveService.getLeaveTypes(targetEmployeeId, companyId);
  }

  // Holiday List
  @Get('holidaylist')
  async getHolidayList() {
    return this.leaveService.getHolidayList();
  }

  // Employee Leave Balance
  @Get('balance')
  async getEmployeeLeaveBalance(@Req() req) {
    return this.leaveService.getEmployeeLeaveBalance(req.user.employeeId);
  }

  // Leave History
  @Get('history')
  async getLeaveHistory(@Req() req) {
    return this.leaveService.getLeaveHistory(req.user.employeeId);
  }

  // Leave Status
  @Get('status')
  async getLeaveStatus(@Req() req) {
    return this.leaveService.getLeaveStatus(req.user.employeeId);
  }

  // Apply Leave
  @Post('apply')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const employeeId = (req as any).user.employeeId;

          const uploadPath = path.join(process.cwd(), 'uploads', employeeId);

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {
              recursive: true,
            });
          }

          cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
          const uniqueFileName = `${uuid()}${extname(file.originalname)}`;

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

    const documentPath = file ? `${employeeId}/${file.filename}` : undefined;

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
  // @UseGuards(JwtAuthGuard)
  // @Post('applyhr')
  // @UseInterceptors(
  //   FileInterceptor('document', {
  //     storage: diskStorage({
  //       destination: (req, file, cb) => {
  //         const employeeId = (req as any).user.employeeId;

  //         const uploadPath = path.join(
  //           process.cwd(),
  //           'uploads',
  //           employeeId,
  //         );

  //         if (!fs.existsSync(uploadPath)) {
  //           fs.mkdirSync(uploadPath, { recursive: true });
  //         }

  //         cb(null, uploadPath);
  //       },

  //       filename: (req, file, cb) => {
  //         cb(null, Date.now() + '-' + file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // async hrApplyLeave(
  //   @Req() req,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: HrLeaveRequestDto,
  // ) {
  //   const employeeId = body.employeeId;
  //   const createdBy = req.user.createdBy;
  //   const documentPath = file
  //     ? `${employeeId}/${file.filename}`
  //     : undefined;

  //   return this.leaveService.hrApplyLeave(
  //     employeeId,
  //     createdBy,
  //     Number(body.leaveTypeId),
  //     body.fromDate,
  //     body.toDate,
  //     body.sessionFrom,
  //     body.sessionTo,
  //     body.isHalfDay,
  //     body.reason,
  //     documentPath,
  //     body.isHRForceApply,
  //   );
  // }

  // Apply leave for another employee. Allowed for the employee's manager and
  // for HR Admin / Super Admin of the same company (checked below); only
  // HR Admin / Super Admin may force-apply.
  //
  // The document is kept in memory until that check has passed, so nothing is
  // written to disk for a caller who is not allowed.
  @Post('applyhr')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async hrApplyLeave(
    @Req() req: any,
    @Body() body: HrLeaveRequestDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const employeeId = String(body.employeeId ?? '').trim();

    // The id becomes a folder name, so only plain ids are accepted.
    if (!/^(?!.*\.\.)[A-Za-z0-9._-]{1,50}$/.test(employeeId)) {
      throw new BadRequestException('Invalid employeeId');
    }

    await this.scope.assertCanAccess(req.user, employeeId);

    if (body.isHRForceApply === true && !this.scope.isAdminPortalUser(req.user)) {
      throw new ForbiddenException('Only HR Admin can force-apply leave.');
    }

    const createdBy = Number(req.user.createdBy);

    let storedFile: string | undefined;
    let documentPath: string | undefined;
    if (file) {
      const folder = path.join(process.cwd(), 'uploads', employeeId);
      await fs.promises.mkdir(folder, { recursive: true });
      const fileName = `${uuid()}${extname(file.originalname)}`;
      storedFile = path.join(folder, fileName);
      await fs.promises.writeFile(storedFile, file.buffer);
      documentPath = `${employeeId}/${fileName}`;
    }

    try {
      return await this.leaveService.hrApplyLeave(
        { ...body, employeeId },
        createdBy,
        documentPath,
      );
    } catch (error) {
      // The leave was not created, so the document is not kept.
      if (storedFile) await fs.promises.unlink(storedFile).catch(() => undefined);
      throw error;
    }
  }
  // Approval / Rejection
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
  @Post('withdrawcancel')
  async withdrawCancelLeave(@Req() req, @Body() body: WithdrawCancelDto) {
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
  async getPendingLeaveRequests(@Req() req) {
    return this.leaveService.getPendingLeaveRequests(req.user.employeeId);
  }

  // Upload Holiday Excel
  @Post('holidaysupload')
  @Roles(...ADMIN_PORTAL_ROLES)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!/\.(xlsx|xls)$/i.test(file.originalname)) {
          return cb(
            new BadRequestException('Only .xlsx or .xls files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadHolidayFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('A file is required');
    }
    return this.leaveService.uploadHolidayFile(file);
  }

  @Get('reporting-employees')
  async getReportingManagerEmployeeList(@Req() req) {
    return this.leaveService.getReportingManagerEmployeeList(
      req.user.createdBy,
    );
  }
  @Get('employee-details')
  async getEmployeeLeaveDetails(
    @Req() req: any,
    @Query('employeeId') employeeId: string,
  ) {
    await this.scope.assertCanAccess(req.user, employeeId);
    return this.leaveService.getEmployeeLeaveDetails(String(employeeId).trim());
  }
}

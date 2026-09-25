import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  ParseIntPipe,
  Query,
  Put,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AdjustmentService } from './adjustment.service';
import { SaveManualLeaveAllotmentDto } from './dto/save-manual-leave-allotment.dto';
import { CreateLeaveAdjustmentDto } from './dto/create-leave-adjustment.dto';
import { UpdateManualAllotmentDto } from './dto/update-manual-allotment.dto';
import { ImportLeaveAdjustmentDto } from './dto/import-leave-adjustment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { GetManualLeaveAllotmentListDto } from './dto/get-manual-leave-allotment-list.dto';

@Controller('admin/ta/leave/adjustment')
@UseGuards(JwtAuthGuard)
export class AdjustmentController {
  constructor(private readonly adjustmentService: AdjustmentService) {}
  // //========================================
  // // Leave Adjustment Configuration
  // // ==========================================
  //   // Leave Adjustment Types
  //   @Get('leavetypes')
  //   async getLeaveTypes() {
  //     return this.adjustmentService.getLeaveTypes();
  //   }

  // //  Configuration

  // @Get('configuration/:leaveId')
  // async getLeaveAdjustmentConfiguration(
  //   @Param('leaveId') leaveId: number,
  // ) {
  //   return this.adjustmentService.getLeaveAdjustmentConfiguration(
  //     leaveId,
  //   );
  // }

  // // Employees

  // @Get('employees')
  // async getEmployees() {
  //   return this.adjustmentService.getEmployees();
  // }

  // // ==========================================
  // // Manual Leave Allotment
  // // ==========================================
  // //- Leave Policies

  // @Get('manualallotment/policies')
  // async getLeavePolicies() {
  //   return this.adjustmentService.getLeavePolicies();
  // }
  // // Policy Leave Types
  // @Get('manualallotment/policies/:policyId/leaves')
  // async getPolicyLeaves(
  //   @Param('policyId', ParseIntPipe) policyId: number,
  // ) {
  //   return this.adjustmentService.getPolicyLeaves(
  //     policyId,
  //   );
  // }
  // // Employee Grid

  // @Get('manualallotment/employees')
  // async getEmployeeAllotments(
  //   @Query('policyId', ParseIntPipe)
  //   policyId: number,

  //   @Query('leaveId', ParseIntPipe)
  //   leaveId: number,
  // ) {
  //   return this.adjustmentService.getEmployeeAllotments(
  //     policyId,
  //     leaveId,
  //   );
  // }
  // // Update Manual Leave Allotment

  // @Put('manualallotment')
  // async updateManualAllotment(
  //   @Body() dto: UpdateManualAllotmentDto,
  // ) {
  //   return this.adjustmentService.updateManualAllotment(
  //     dto,
  //   );
  // }
  // // ==========================================
  // // Import
  // // ==========================================
  // //- Template Types
  // //operation is not known
  // // Pay Months

  // @Get('import/paymonths')
  // async getPayMonths() {
  //   return this.adjustmentService.getPayMonths();
  // }
  // // Leave Adjustment

  // @Post('import')
  // @UseInterceptors(FileInterceptor('file'))
  // async importLeaveAdjustment(
  //   @UploadedFile() file: any,
  //   @Body() dto: ImportLeaveAdjustmentDto,
  // ) {
  //   return this.adjustmentService.importLeaveAdjustment(
  //     file,
  //     dto,
  //   );
  // }

  //starting from here actual SPs
  @Post('configuration')
  async createLeaveAdjustment(
    @Req() req: any,
    @Body() dto: CreateLeaveAdjustmentDto,
  ) {
    return this.adjustmentService.createLeaveAdjustment(
      dto,
      req.user.createdBy,
    );
  }

  // ==========================================
  // Save Manual Leave Allotment
  // ==========================================

  @Post('manual-allotment')
  async saveManualLeaveAllotment(
    @Req() req: any,
    @Body() dto: SaveManualLeaveAllotmentDto,
  ) {
    return this.adjustmentService.saveManualLeaveAllotment(
      dto,
      req.user.createdBy,
    );
  }

  @Get('manual-allotment')
  async getManualLeaveAllotmentList(
    @Req() req: any,
    @Query() dto: GetManualLeaveAllotmentListDto,
  ) {
    return this.adjustmentService.getManualLeaveAllotmentList(
      dto,
      req.user.companyId,
    );
  }
}

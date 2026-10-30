import { GetLeaveApprovalDto } from './dto/get-leave-approval.dto';
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ForceLeaveApprovalService } from './forceleaveapproval.service';
import { ApproveRejectLeaveDto } from './dto/approve-reject-leave.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin/ta/leave/forceleaveapproval')
@UseGuards(JwtAuthGuard)
export class ForceLeaveApprovalController {
  constructor(
    private readonly forceLeaveApprovalService: ForceLeaveApprovalService,
  ) {}

  // ==========================================
  // Approve Leave
  // ==========================================

  @Post('approve')
  async approveLeave(@Body() dto: ApproveRejectLeaveDto) {
    return this.forceLeaveApprovalService.approveLeave(dto);
  }

  // ==========================================
  // Reject Leave
  // ==========================================

  @Post('reject')
  async rejectLeave(@Body() dto: ApproveRejectLeaveDto) {
    return this.forceLeaveApprovalService.rejectLeave(dto);
  }

  // Starting from here actual SPs

  // @Get()
  // async getLeaveApproval(
  //   @Req() req: any,
  //   @Query() query: {
  //     approverId?: string;
  //     fromDate?: string;
  //     toDate?: string;
  //     isCurrentMonth?: string;
  //   },
  // ) {
  //   return this.forceLeaveApprovalService.getLeaveApproval(
  //     Number(req.user.companyId),
  //     query.approverId,
  //     query.fromDate,
  //     query.toDate,
  //     query.isCurrentMonth === undefined
  //       ? true
  //       : query.isCurrentMonth.toLowerCase() === 'true',
  //   );
  // }

 
@Post()
async getLeaveApproval(
  @Req() req: any,
  @Body() dto: GetLeaveApprovalDto,
) {
  return this.forceLeaveApprovalService.getLeaveApproval(
    dto,
    req.user.companyId,
  );
}
 
 // Company dropdown (filters: branch, salary structure, leave, attendance, designation, emp status)
// Actual SP is used here
 
@Get('company-dropdown')
@UseGuards(JwtAuthGuard)
async getCompanyDropdownData(@Req() req: any) {
  return this.forceLeaveApprovalService.getCompanyDropdownData(req.user.companyId);
}
}

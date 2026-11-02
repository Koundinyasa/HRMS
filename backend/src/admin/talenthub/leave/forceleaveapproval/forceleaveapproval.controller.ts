import { GetLeaveApprovalDto } from './dto/get-leave-approval.dto';
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ForceLeaveApprovalService } from './forceleaveapproval.service';
import { ApproveRejectLeaveDto } from './dto/approve-reject-leave.dto';
import { BulkHierarchicalLeaveActionDto } from './dto/bulk-hierarchical-leave-action.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';
import { RequiresMenu } from '../../../../common/decorators/module-gate.decorator';
import { MenuCode } from '../../../../common/constants/menu-codes';

@Roles(...ADMIN_PORTAL_ROLES)
@RequiresMenu(MenuCode.ForceLeaveApproval)
@Controller('admin/ta/leave/forceleaveapproval')
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

  // ==========================================
  // Bulk Hierarchical Leave Action
  // Bulk and single approve / reject
  // ==========================================

  @Post('bulk-hierarchical-action')
  async bulkHierarchicalLeaveAction(
    @Req() req: any,
    @Body() dto: BulkHierarchicalLeaveActionDto,
  ) {
    return this.forceLeaveApprovalService.bulkHierarchicalLeaveAction(
      dto,
      req.user.employeeId,
      Number(req.user.companyId),
    );
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
async getCompanyDropdownData(@Req() req: any) {
  return this.forceLeaveApprovalService.getCompanyDropdownData(req.user.companyId);
}
}

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
  async approveLeave(
    @Body() dto: ApproveRejectLeaveDto,
  ) {
    return this.forceLeaveApprovalService.approveLeave(dto);
  }

  // ==========================================
  // Reject Leave
  // ==========================================

  @Post('reject')
  async rejectLeave(
    @Body() dto: ApproveRejectLeaveDto,
  ) {
    return this.forceLeaveApprovalService.rejectLeave(dto);
  }


  // Starting from here actual SPs
  
 @Get()
  async getLeaveApproval(
    @Req() req: any,
    @Body() body: {
      approverId?: string;
      fromDate?: string;
      toDate?: string;
      isCurrentMonth?: boolean;
    },
  ) {
    console.log('JWT User:', req.user);
    console.log('Company ID:', req.user?.companyId);
    console.log('Request Body:', body);

    return this.forceLeaveApprovalService.getLeaveApproval(
      Number(req.user.companyId),
      body.approverId,
      body.fromDate,
      body.toDate,
      body.isCurrentMonth ?? true,
    );
  }
}
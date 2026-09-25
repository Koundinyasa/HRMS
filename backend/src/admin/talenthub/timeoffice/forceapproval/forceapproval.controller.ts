import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ForceApprovalService } from './forceapproval.service';

@Controller('admin/timeattendance/timeoffice/forceapproval')
@UseGuards(JwtAuthGuard)
export class ForceApprovalController {
  constructor(private readonly forceApprovalService: ForceApprovalService) {}

  // =====================================================
  // PUNCH
  // =====================================================

  @Get('punch')
  async getPunchApproval() {
    return this.forceApprovalService.getPunchApproval();
  }

  // =====================================================
  // FACE TEMPLATE
  // =====================================================

  @Get('facetemplate')
  async getFaceTemplateApproval() {
    return this.forceApprovalService.getFaceTemplateApproval();
  }

  // We have approve and reject buttons in both tabs but their operations and body parameters are unknown so leaving it until db is ready
}

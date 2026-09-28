import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

import { ComplianceOverviewService } from './compliance-overview.service';
import { ComplianceOverviewDto } from './dto/company-compliance-overview.dto';

@Controller('admin/group-of-company/details/compliance-overview')
@UseGuards(JwtAuthGuard)
export class ComplianceOverviewController {
  constructor(
    private readonly complianceOverviewService: ComplianceOverviewService,
  ) { }

  @Post()
  async getComplianceOverview(
    @Req() req: any,
    @Body() dto: ComplianceOverviewDto,
  ) {
    const companyId = req.user.companyId;

    return this.complianceOverviewService.getComplianceOverview(
      companyId,
      dto,
    );
  }
}
import {
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';


import { ComplianceOverviewService } from './compliance-overview.service';
import { ComplianceOverviewDto } from './dto/company-compliance-overview.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin/group-of-company/details/compliance-overview')
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
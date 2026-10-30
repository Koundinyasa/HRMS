import {
  Controller,
  Get,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller(
  'admin/group-of-company/approvals',
)
export class ApprovalsController {
  constructor(
    private readonly approvalsService: ApprovalsService,
  ) {}

  @Get()
  async getAllCompanyApprovals() {
    return this.approvalsService.getAllCompanyApprovals();
  }
}
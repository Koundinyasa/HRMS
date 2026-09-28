import {
  Controller,
  Get,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';

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
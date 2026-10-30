import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ConsolidatedSalaryService } from './consolidated-salary.service';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller(
  'admin/group-of-company/details/consolidated-salary',
)
export class ConsolidatedSalaryController {
  constructor(
    private readonly consolidatedSalaryService: ConsolidatedSalaryService,
  ) {}

  @Get()
  async getConsolidatedSalary(
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('companyId') companyId?: string,
  ) {
    return this.consolidatedSalaryService.getConsolidatedSalary(
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
      companyId ? Number(companyId) : undefined,
    );
  }
}
import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ConsolidatedSalaryService } from './consolidated-salary.service';

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
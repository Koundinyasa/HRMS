import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
 
import { EmployeeDetailsService } from './employee-details.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { OrganizationChartDto } from './dto/organization-chart.dto';
import { UpdateEmployeeGeneralDetailsDto } from './dto/update-employee-general-details.dto';
 
@Controller('admin/employee-details')
@UseGuards(JwtAuthGuard)
export class EmployeeDetailsController {
  constructor(
    private readonly employeeDetailsService: EmployeeDetailsService,
  ) { }
 
  // ==========================================
  // Employees By Company
  // ==========================================
 
  @Get('employees')
  async getEmployeesByCompanyId(@Req() req: any) {
    const companyId = req.user?.companyId;
 
    if (!companyId) {
      throw new BadRequestException(
        'CompanyId not found in JWT',
      );
    }
 
    return this.employeeDetailsService.getEmployeesByCompanyId(
      Number(companyId),
    );
  }
 
  // ==========================================
  // Get Employee Details
  // ==========================================
 
  @Get(':employeeId')
  async getEmployeeDetails(
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeDetailsService.getEmployeeDetails(
      employeeId,
    );
  }
 
  // ==========================================
  // Organization Chart
  // ==========================================
 
  @Post('organization-chart')
  async getOrganizationChart(
    @Body() dto: OrganizationChartDto,
    @Req() req: any,
  ) {
    const companyId = req.user.companyId;
 
    return this.employeeDetailsService.getOrganizationChart(
      dto,
      companyId,
    );
  }
 
  // ==========================================
  // Update General Details
  // ==========================================
 
  @Post('general-details/update')
  async updateEmployeeGeneralDetails(
    @Body() dto: UpdateEmployeeGeneralDetailsDto,
    @Req() req: any,
  ) {
    const modifiedBy = Number(req.user?.createdBy);
 
 
    return this.employeeDetailsService.updateEmployeeGeneralDetails(
      dto,
      modifiedBy,
    );
  }
}
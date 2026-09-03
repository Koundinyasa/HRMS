import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

import { EmployeesService } from './employees.service';

import { GetEmployeesDto } from './dto/get-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin/user-management/employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) { }

  // GET EMPLOYEE LIST
  @Get()
  async getEmployees(
    @Query() dto: GetEmployeesDto,
  ) {
    return this.employeesService.getEmployees(dto);
  }

  // GET LOOKUPS
  @Get('lookups/all')
  async getLookups() {
    return this.employeesService.getLookups();
  }

  // GET EMPLOYEE DETAILS
  @Get(':employeeId')
  async getEmployeeDetails(
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeesService.getEmployeeDetails(
      employeeId,
    );
  }

  // CREATE / UPDATE USER
  @Put()
  async updateEmployee(
    @Body() dto: UpdateEmployeeDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeesService.updateEmployee(
      dto,
      modifiedBy,
    );
  }

  // LOCK / UNLOCK / RESET PASSWORD
  @Patch('security')
  async manageSecurity(
    @Body() dto: UpdateEmployeeStatusDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeesService.manageSecurity(
      dto,
      modifiedBy,
    );
  }
}
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';


import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { Permission } from '../common/decorators/permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('employee')
@UseGuards(JwtAuthGuard)  // all routes in this controller require auth
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

}
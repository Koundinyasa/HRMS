import { Controller, Get } from '@nestjs/common';

@Controller('employee')
export class EmployeeController {

  @Get()
  getAll() {
    return {
      message: 'Employee List'
    };
  }
}
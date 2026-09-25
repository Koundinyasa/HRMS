import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  //GET dashbaord summary
  @Get()
  getDashboard() {}
}

import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin')
export class AdminController {
  //GET dashbaord summary
  @Get()
  getDashboard() {}
}

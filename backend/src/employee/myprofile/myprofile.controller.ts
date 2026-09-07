import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MyprofileService } from './myprofile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('employee/myprofile')
@UseGuards(JwtAuthGuard)
export class MyprofileController {

  constructor(
    private readonly myprofileService: MyprofileService,
  ) {}

  @Get('info')
  async getMyProfile(@Req() req: any) {
    return await this.myprofileService.getEmployeeInfo(
      req.user.employeeId,
    );
  }

  @Get('test')
test() {
  return {
    message: 'Myprofile controller working'
  };
}
}
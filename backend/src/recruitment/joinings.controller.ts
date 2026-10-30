import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ConfirmJoiningDto } from './dto/confirm-joining.dto';
import { PrepareJoiningDto } from './dto/prepare-joining.dto';
import { UpdateJoiningDto } from './dto/update-joining.dto';
import { JoiningsService } from './joinings.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('joinings')
@UseGuards(JwtAuthGuard)
export class JoiningsController {
  constructor(private readonly joiningsService: JoiningsService) {}

  @Get()
  list(@Req() req: { user: { employeeId: string } }) {
    return this.joiningsService.getJoinings(req.user.employeeId);
  }

  @Get(':id')
  get(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.joiningsService.getJoining(id, req.user.employeeId);
  }

  @Post()
  prepare(
    @Body() dto: PrepareJoiningDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.joiningsService.prepareJoining(dto, req.user.employeeId);
  }

  @Patch(':id')
  updateDate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJoiningDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.joiningsService.updateJoiningDate(id, dto, req.user.employeeId);
  }

  @Post(':id/send-email')
  sendEmail(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.joiningsService.sendJoiningEmail(id, req.user.employeeId);
  }

  @Post(':id/confirm')
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmJoiningDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.joiningsService.confirmJoining(id, dto, req.user.employeeId);
  }
}

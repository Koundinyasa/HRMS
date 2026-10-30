import { Body, Controller, Post, Req } from '@nestjs/common';

import { AdmincenterEssPollsService } from './admincenter.ess.polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('ess/polls')
export class AdmincenterEssPollsController {
  constructor(private readonly pollsService: AdmincenterEssPollsService) {}

  @Post()
  async createPoll(@Body() dto: CreatePollDto, @Req() req: any) {
    const createdBy = req.user?.userId;

    return this.pollsService.createPoll(dto, createdBy);
  }
}

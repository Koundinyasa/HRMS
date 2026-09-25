import { Body, Controller, Post, Req } from '@nestjs/common';

import { AdmincenterEssPollsService } from './admincenter.ess.polls.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Controller('ess/polls')
export class AdmincenterEssPollsController {
  constructor(private readonly pollsService: AdmincenterEssPollsService) {}

  @Post()
  async createPoll(@Body() dto: CreatePollDto, @Req() req: any) {
    const createdBy = req.user?.userId;

    return this.pollsService.createPoll(dto, createdBy);
  }
}

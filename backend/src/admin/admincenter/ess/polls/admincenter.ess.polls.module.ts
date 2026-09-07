import { Module } from '@nestjs/common';
import { AdmincenterEssPollsController} from './admincenter.ess.polls.controller';
import { AdmincenterEssPollsService } from './admincenter.ess.polls.service';

@Module({
  controllers: [AdmincenterEssPollsController],
  providers: [AdmincenterEssPollsService]
})
export class AdmincenterEssPollsModule{}

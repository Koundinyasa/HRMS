import { Module } from '@nestjs/common';
import { HelpdeskController } from './helpdesk.controller';
import { HelpdeskService } from './helpdesk.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HelpdeskController],
  providers: [HelpdeskService],
})
export class HelpdeskModule {}
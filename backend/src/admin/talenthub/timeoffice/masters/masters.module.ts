import { Module } from '@nestjs/common';

import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';

import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MastersController],
  providers: [MastersService],
})
export class MastersModule {}
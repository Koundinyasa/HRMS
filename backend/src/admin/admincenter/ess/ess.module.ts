import { Module } from '@nestjs/common';
import { EssController } from './ess.controller';
import { EssService } from './ess.service';
import { DatabaseModule } from '../../../database/database.module';
 
@Module({
  imports: [DatabaseModule],
  controllers: [EssController],
  providers: [EssService],
})
export class EssModule {}
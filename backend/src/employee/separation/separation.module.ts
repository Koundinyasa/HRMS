import { Module } from '@nestjs/common';
import { SeparationController } from './separation.controller';
import { SeparationService } from './separation.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SeparationController],
  providers: [SeparationService],
})
export class SeparationModule {}

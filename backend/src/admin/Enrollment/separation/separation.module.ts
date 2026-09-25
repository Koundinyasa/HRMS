import { Module } from '@nestjs/common';
import { SeparationController } from './separation.controller';
import { SeparationService } from './separation.service';

@Module({
  controllers: [SeparationController],
  providers: [SeparationService],
})
export class SeparationModule {}

import { Module } from '@nestjs/common';
import { AdmincenterEssCircularController } from './admincenter.ess.circular.controller';
import { AdmincenterEssCircularService } from './admincenter.ess.circular.service';

@Module({
  controllers: [AdmincenterEssCircularController],
  providers: [AdmincenterEssCircularService],
  exports: [AdmincenterEssCircularService],
})
export class AdmincenterEssCircularModule {}

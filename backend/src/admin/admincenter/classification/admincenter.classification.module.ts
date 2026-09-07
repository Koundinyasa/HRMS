import { Module } from '@nestjs/common';
import { AdmincenterClassificationController } from './admincenter.classification.controller';
import { AdmincenterClassificationService } from './admincenter.classification.service';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AdmincenterClassificationController],
  providers: [AdmincenterClassificationService]
})
export class AdmincenterClassificationModule {}

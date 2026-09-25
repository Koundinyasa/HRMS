import { Module } from '@nestjs/common';

import { ForceApprovalController } from './forceapproval.controller';
import { ForceApprovalService } from './forceapproval.service';

import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ForceApprovalController],
  providers: [ForceApprovalService],
})
export class ForceApprovalModule {}

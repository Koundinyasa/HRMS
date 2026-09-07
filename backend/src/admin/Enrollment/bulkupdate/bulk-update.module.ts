import { Module } from '@nestjs/common';
import { BulkUpdateController } from './bulk-update.controller';
import { BulkUpdateService } from './bulk-update.service';

@Module({
  controllers: [BulkUpdateController],
  providers: [BulkUpdateService],
})
export class BulkUpdateModule {}
import { Module } from '@nestjs/common';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LeaveController],
  providers: [LeaveService],
  // The chatbot calls this service directly instead of going through HTTP.
  exports: [LeaveService],
})
export class LeaveModule {}

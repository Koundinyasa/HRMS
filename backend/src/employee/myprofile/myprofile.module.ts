import { Module } from '@nestjs/common';
import { MyprofileController } from './myprofile.controller';
import { MyprofileService } from './myprofile.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MyprofileController],
  providers: [MyprofileService],
})
export class MyprofileModule {}

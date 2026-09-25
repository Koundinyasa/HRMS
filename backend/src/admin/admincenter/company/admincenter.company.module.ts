import { Module } from '@nestjs/common';
import { AdmincentercompanyController } from './admincenter.company.controller';
import { AdmincentercompanyService } from './admincenter.company.service';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AdmincentercompanyController],
  providers: [AdmincentercompanyService],
})
export class AdmincentercompanyModule {}

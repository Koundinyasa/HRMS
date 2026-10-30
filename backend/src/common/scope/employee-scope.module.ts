import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeScopeService } from './employee-scope.service';

/** Global: any controller can inject EmployeeScopeService without importing this module. */
@Global()
@Module({
  imports: [DatabaseModule],
  providers: [EmployeeScopeService],
  exports: [EmployeeScopeService],
})
export class EmployeeScopeModule {}

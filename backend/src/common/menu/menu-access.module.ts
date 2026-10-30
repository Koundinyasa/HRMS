import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MenuAccessService } from './menu-access.service';

/** Global: the module gate (and later the sidebar API) can inject MenuAccessService. */
@Global()
@Module({
  imports: [DatabaseModule],
  providers: [MenuAccessService],
  exports: [MenuAccessService],
})
export class MenuAccessModule {}

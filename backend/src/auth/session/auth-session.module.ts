import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthSessionService } from './auth-session.service';

/**
 * Global, because JwtAuthGuard needs AuthSessionService and that guard is
 * referenced with @UseGuards(JwtAuthGuard) from controllers in many modules.
 */
@Global()
@Module({
  imports: [DatabaseModule],
  providers: [AuthSessionService],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}

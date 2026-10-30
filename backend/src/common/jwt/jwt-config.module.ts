import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { parseDurationToMs } from '../utils/duration';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        // ACCESS_TOKEN_TTL (default 15m). The old JWT_EXPIRES_IN setting is
        // not read here; only ACCESS_TOKEN_TTL decides the lifetime.
        const accessTtl = config.get<string>('auth.accessTtl') ?? '15m';
        return {
          secret: config.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: Math.floor(parseDurationToMs(accessTtl) / 1000),
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}

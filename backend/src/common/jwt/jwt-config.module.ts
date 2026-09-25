import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const expiresIn = config.get<number | string>('jwt.expiresIn');
        return {
          secret: config.get<string>('jwt.secret'),
          signOptions: {
            expiresIn:  '24h',
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}

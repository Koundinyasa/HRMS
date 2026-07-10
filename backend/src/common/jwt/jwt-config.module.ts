import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('jwt.expiresIn');
        return {
          secret: config.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
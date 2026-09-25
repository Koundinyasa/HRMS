import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger.config';
import { LoggingInterceptor } from './logging.interceptor';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [LoggingInterceptor, HttpExceptionFilter],
  exports: [WinstonModule, LoggingInterceptor, HttpExceptionFilter],
})
export class LoggerModule {}

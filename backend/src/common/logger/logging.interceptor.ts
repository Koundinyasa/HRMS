import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';
 
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    
  }
 
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
 
const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
 
    const start = Date.now();
 
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
 
        this.logger.info('HTTP Request Completed', {
          method: request.method,
          url: request.originalUrl,
          statusCode: response.statusCode,
          duration,
          ip: request.ip,
          employeeId: (request as any).user?.employeeId ?? null,
          userId: (request as any).user?.userId ?? null,
        });
      }),
    );
  }
}
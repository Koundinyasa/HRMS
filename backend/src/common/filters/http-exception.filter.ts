import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? ((exception.getResponse() as any)?.message ?? exception.message)
        : 'Internal server error';

    // A machine-readable `code` (for example REFRESH_RACE) set by the code
    // that threw the exception is passed through to the client.
    const body = exception instanceof HttpException ? exception.getResponse() : undefined;
    const code =
      body && typeof body === 'object' && typeof (body as any).code === 'string'
        ? ((body as any).code as string)
        : undefined;

    const details = {
      method: request.method,
      url: request.originalUrl,
      statusCode: status,
      employeeId: (request as any).user?.employeeId ?? null,
      userId: (request as any).user?.userId ?? null,
      ip: request.ip,
    };

    if (status >= 500) {
      // Real server faults: keep the stack trace.
      this.logger.error(message, {
        ...details,
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    } else {
      // Expected client errors (wrong password, validation, 401, 403, 404,
      // 429): one warning line, no stack trace. Stack traces for these only
      // bury the real errors.
      this.logger.warn(message, details);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(code ? { code } : {}),
    });
  }
}

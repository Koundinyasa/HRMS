import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/logger/logging.interceptor';
import { createRequireAuth } from './common/middleware/require-auth.middleware';
import { AuthSessionService } from './auth/session/auth-session.service';
import { Role } from './common/constants/roles';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Lets modules close their database pools when the process is told to stop.
  app.enableShutdownHooks();
  const server = app.getHttpAdapter().getInstance();

  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);
  const sessions = app.get(AuthSessionService);

  // Same rules as the global JwtAuthGuard: valid token, live session.
  const requireAuthOptions = {
    jwtService,
    sessions,
    allowLegacyTokens:
      configService.get<boolean>('auth.allowLegacyTokens') === true,
  };

  const isProd = configService.get<string>('environment') === 'production';
  const port = configService.get<number>('port') ?? 3001;

  // Swagger is a development tool. In production it stays off unless
  // SWAGGER_ENABLED=true, and then it is limited to logged-in admins.
  const swaggerEnabled =
    !isProd || configService.get<boolean>('swaggerEnabled') === true;

  if (!process.env.NODE_ENV) {
    process.stdout.write(
      '[startup] NODE_ENV is not set, so the app runs in development mode ' +
        '(Swagger open, captcha answer returned by the API). ' +
        'Set NODE_ENV=production on any real deployment.\n',
    );
  }

  // Behind a reverse proxy / load balancer, set TRUST_PROXY to the number of
  // proxies in front of the app so request.ip (used for rate limiting and
  // logs) is the real client address. Leave at 0 when the app is exposed
  // directly: trusting X-Forwarded-For there would let anyone fake their IP.
  const trustProxyHops = configService.get<number>('trustProxy') ?? 0;
  if (trustProxyHops > 0) {
    server.set('trust proxy', trustProxyHops);
  }

  // Security headers. The strict Content-Security-Policy is only applied when
  // Swagger UI is off, because Swagger UI needs inline scripts and styles.
  // crossOriginResourcePolicy is relaxed so the frontend (another origin) can
  // still load files served by this API.
  app.use(
    helmet({
      contentSecurityPolicy: isProd && !swaggerEnabled ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hsts: isProd,
    }),
  );

  app.use(cookieParser());

  // Files in backend/documents require a logged-in user.
  // dotfiles are never served and directory listings are off.
  server.use(
    '/documents',
    createRequireAuth(requireAuthOptions),
    express.static(join(process.cwd(), 'documents'), {
      index: false,
      dotfiles: 'deny',
    }),
  );

  app.setGlobalPrefix('api');

  // --- Swagger Setup Start ---
  if (swaggerEnabled) {
    if (isProd) {
      server.use(
        ['/api-docs', '/api-docs-json', '/api-docs-yaml'],
        createRequireAuth(requireAuthOptions, [Role.Admin]),
      );
    }

    const config = new DocumentBuilder()
      .setTitle('People360 HRMS API')
      .setDescription('Core backend API documentation for KTS-People360 HRMS')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'JWT-auth',
      )
      .addCookieAuth('auth-cookie')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Swagger UI
    SwaggerModule.setup('api-docs', app, document);
  }
  // --- Swagger Setup End ---

  // CORS: the configured frontend origin(s) only. The local development
  // ports are added automatically outside production.
  const configuredFrontendUrl =
    configService.get<string>('frontendUrl') ?? 'http://localhost:5173';
  const allowedFrontendOrigins = new Set(
    configuredFrontendUrl
      .split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean),
  );
  if (!isProd) {
    [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ].forEach((origin) => allowedFrontendOrigins.add(origin));
  }

  app.enableCors({
    origin: (requestOrigin, callback) => {
      // No Origin header: same-origin requests, curl, server-to-server.
      if (!requestOrigin || allowedFrontendOrigins.has(requestOrigin)) {
        callback(null, true);
        return;
      }

      // Not allowed: send no CORS headers, so the browser blocks the call.
      // (Passing an Error here would turn it into a logged 500.)
      callback(null, false);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    app.get(LoggingInterceptor),
  );

  app.useGlobalFilters(
    app.get(HttpExceptionFilter),
  );

  await app.listen(port);

  console.log(`Application running on port ${port}`);
  if (swaggerEnabled) {
    console.log(
      `Swagger documentation available at http://localhost:${port}/api-docs`,
    );
  }
  console.log(
    `Documents available at http://localhost:${port}/documents/ (login required)`,
  );
}

bootstrap();

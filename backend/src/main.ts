import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/logger/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve documents stored in the backend/documents folder
  app
    .getHttpAdapter()
    .getInstance()
    .use(
      '/documents',
      express.static(join(process.cwd(), 'documents')),
    );

  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  // --- Swagger Setup Start ---
  const config = new DocumentBuilder()
    .setTitle('People360 HRMS API')
    .setDescription(
      'Core backend API documentation for KTS-People360 HRMS',
    )
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
  // --- Swagger Setup End ---

  const configuredFrontendUrl =
    configService.get<string>('frontendUrl') ?? 'http://localhost:5173';
  const allowedFrontendOrigins = new Set([
    ...configuredFrontendUrl.split(',').map((origin) => origin.trim()).filter(Boolean),
    'http://localhost:5173',
    'http://localhost:5174',
  ]);

  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedFrontendOrigins.has(requestOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${requestOrigin} is not allowed by CORS`), false);
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

  const port = configService.get<number>('port') ?? 3001;

  await app.listen(port);

  console.log(`Application running on port ${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`,
  );
  console.log(
    `Documents available at http://localhost:${port}/documents/`,
  );
}

bootstrap();
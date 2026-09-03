import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/logger/logging.interceptor';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.enableCors({

    // origin: 'http://localhost:5173',
    origin: configService.get<string>('frontendUrl'),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  // app.useGlobalFilters(new HttpExceptionFilter());


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
}

bootstrap();
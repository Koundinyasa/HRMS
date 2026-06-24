// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// //import cookieParser from 'cookie-parser';

// dotenv.config();
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);


//   //app.use(cookieParser());

//   app.setGlobalPrefix('api');
//   app.enableCors({
//   // origin: 'http://localhost:5173',
//   origin:true,
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
// });
  
//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();
// // app.enableCors({
// //   origin: 'http://localhost:5173',
// //   credentials: true,
// // });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
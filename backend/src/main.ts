import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
  // origin: 'http://localhost:5173',
  origin:true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});
  //   app.enableCors({
  //    origin: 'http://localhost:5173',
  //    credentials: true,
  // });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
// app.enableCors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// });
import * as dotenv from 'dotenv';
dotenv.config();
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: 'http://localhost:3000',//'http://app.lifetider.com',
    credentials: true,
  }));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,

      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  );

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();

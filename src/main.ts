import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adding global validation pipe
  app.useGlobalPipes(new ValidationPipe({transform :  true}))

  // adding configuration
  const configService : ConfigService = app.get(ConfigService)

  // setting cookie parser
  app.use(cookieParser());

  // cors origin
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // app.enableCors({
  //   origin: '*',
  //   credentials: true,
  // });

const port = process.env.port || 8080;
  await app.listen(port);
}
bootstrap();

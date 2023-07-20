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

  // setting firebase admin
  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     projectId: configService.get('FIREBASE_PROJECT_ID'),
  //     privateKey: configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  //     clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
  //   }),
  //   databaseURL: configService.get('FIREBASE_DATABASE_URL'),
  // });

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();

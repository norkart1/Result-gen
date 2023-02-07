import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adding global validation pipe
  app.useGlobalPipes(new ValidationPipe())

  // adding configuration
  const configService : ConfigService = app.get(ConfigService)

  await app.listen(configService.get('PORT'));
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adding global validation pipe
  app.useGlobalPipes(new ValidationPipe({transform :  true}))

  // adding configuration
  const configService : ConfigService = app.get(ConfigService)

  // file upload
  // app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10    }));

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();

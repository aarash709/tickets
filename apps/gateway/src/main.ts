/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Filter } from './filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new Filter());

  //ignores global prefix
  setupSwagger(app, globalPrefix);

  const port = process.env.GATEWAY_PORT || 3000;

  await app.listen(port);
  Logger.log(
    `🚀 GATEWAY is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

function setupSwagger(app: INestApplication, globalPrefix?: string) {
  const swaggerDocument = new DocumentBuilder()
    .setTitle('tickets')
    .setDescription('A ticket reservation system demo')
    .addBearerAuth()
    .setVersion('0.1-alpha-demo')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);
}

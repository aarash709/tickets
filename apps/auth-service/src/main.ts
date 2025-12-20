/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RPCFilter } from '@tickets/shared';

async function bootstrap() {
  const natsUrl = process.env.NATS_URL as string;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    { transport: Transport.NATS, options: { servers: [natsUrl] } },
  );
  app.useGlobalFilters(new RPCFilter())
  await app.listen();
  Logger.log(`🚀 Auth service is running on: NATS`);
}

bootstrap();

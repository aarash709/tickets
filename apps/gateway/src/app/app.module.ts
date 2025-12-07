import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  InventoryServive,
  PaymentService,
  ReserveService as ReservationService,
} from './constants';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ReservationService,
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
      {
        name: PaymentService,
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

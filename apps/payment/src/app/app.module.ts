import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookingService } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BookingService,
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'booking', brokers: ['localhost:9092'] },
          consumer: {
            groupId: 'booking_consumer',
          },
        },
      },
      {
        name: 'inventory_service',
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'inventory', brokers: ['localhost:9092'] },
          consumer: {
            groupId: 'inventory_consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

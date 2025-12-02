import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Payment_Service } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Payment_Service,
        transport: Transport.KAFKA,
        options: {
          client: {
            clienId: 'payment',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'payment_consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

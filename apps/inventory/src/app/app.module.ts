import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([{
      name: "payment_service",
      transport: Transport.KAFKA,
      options: {
        client: {
          clienId: "booking_client_id",
          brokers: ["localhost:9092"]
        },
        consumer: {
          groupId: "inventory_group_id"
        }
      }
    }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

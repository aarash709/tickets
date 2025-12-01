import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([{
    name: "booking_service", transport: Transport.KAFKA, options: {
      client: { brokers: ["localhost:9092"] },
      consumer: {
        groupId: "booking_group_id"
      }
    }
  },
  {
    name: "inventory_service", transport: Transport.KAFKA, options: {
      client: { brokers: ["localhost:9092"] },
      consumer: {
        groupId: "inventory_group_id"
      }
    }
  }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

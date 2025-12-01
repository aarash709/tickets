import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryServive } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: InventoryServive,
        transport: Transport.KAFKA,
        options: { client: { clientId: 'gateway', brokers: ['localhost:9092'] }, consumer: { groupId: "inventory-consumer" } },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ClientProxyFactory,
} from '@nestjs/microservices';
import { NatsService } from './constants';
import { ClientConfigModule, ClientConfigService } from '@tickets/shared';

@Module({
  imports: [ClientConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      inject: [ClientConfigService],
      provide: NatsService,
      useFactory: (config: ClientConfigService) => {
        const natsOptions = config.natsOpions;
        return ClientProxyFactory.create(natsOptions);
      },
    },
  ],
})
export class AppModule {}

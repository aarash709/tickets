import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule, ClientConfigService } from '@tickets/shared';
import { NATSService } from './constants';
import { CacheModule } from '@nestjs/cache-manager';
import { SeatsController } from './seats/seats.service';
import { PaymentController } from './payment/payment.service';

@Module({
  imports: [CacheModule.register({ isGlobal: false }), ClientConfigModule],
  controllers: [AppController, SeatsController, PaymentController],
  providers: [
    AppService,
    {
      inject: [ClientConfigService],
      provide: NATSService,
      useFactory: (config: ClientConfigService) => {
        const natsOptions = config.natsOpions;
        return ClientProxyFactory.create(natsOptions);
      },
    },
  ],
})
export class AppModule {}

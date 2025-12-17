import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import {
  ClientConfigModule,
  ClientConfigService,
  JWTStrategy,
  PassportJwtGuard,
} from '@tickets/shared';
import { NATSService } from './constants';
import { CacheModule } from '@nestjs/cache-manager';
import { SeatsController } from './seats/seats.service';
import { PaymentController } from './payment/payment.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [CacheModule.register({ isGlobal: false }), ClientConfigModule],
  controllers: [
    AppController,
    SeatsController,
    PaymentController,
    AuthController,
  ],
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
    JWTStrategy,
    PassportJwtGuard,
  ],
})
export class AppModule {}

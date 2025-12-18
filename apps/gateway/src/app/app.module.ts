import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import {
  ClientConfigModule,
  ClientConfigService,
  secret,
} from '@tickets/shared';
import { NATSService } from './constants';
import { CacheModule } from '@nestjs/cache-manager';
import { SeatsController } from './seats/seats.service';
import { PaymentController } from './payment/payment.service';
import { AuthController } from './auth/auth.controller';
import { JWTStrategy } from './guards/jwt.strategy';
import { PassportJwtGuard } from './guards/jwt.gurad';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.register({ isGlobal: false }),
    JwtModule.register({
      secret: secret,
    }),
    ClientConfigModule,
  ],
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

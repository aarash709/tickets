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
import { PassportJwtGuard } from './guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    CacheModule.register({ isGlobal: false }),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: '5m' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: seconds(5),
          limit: 10,
        },
        {
          name: 'long',
          ttl: seconds(30),
          limit: 30,
        },
      ],
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    PassportJwtGuard,
    RolesGuard,
    JWTStrategy,
  ],
})
export class AppModule {}

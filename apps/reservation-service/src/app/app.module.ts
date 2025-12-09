import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '../database/database.module';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { MurLockModule } from 'murlock';

@Module({
  imports: [
    DatabaseModule,
    MurLockModule.forRoot({
      redisOptions: { url: 'redis://localhost:6379' },
      wait: 1000,
      maxAttempts: 3,
      logLevel: 'log',
      lockKeyPrefix: 'custom',
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [new KeyvRedis('redis://localhost:6379')],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

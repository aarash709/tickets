import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { MurLockModule } from 'murlock';
import { ClientConfigModule, ClientConfigService } from '@tickets/shared';

@Module({
  imports: [
    DatabaseModule,
    ClientConfigModule,
    MurLockModule.forRootAsync({
      imports: [ClientConfigModule],
      useFactory: async (config: ClientConfigService) => {
        return {
          redisOptions: { url: config.getRedisURL() },
          wait: 1000,
          maxAttempts: 3,
          logLevel: 'log',
          lockKeyPrefix: 'custom',
        };
      },
      inject: [ClientConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [new KeyvRedis(process.env.REDIS_URL)],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientConfigModule, ClientConfigService } from '@tickets/shared';
import { RedlockModule } from 'nestjs-redlock-universal';
import { NodeRedisAdapter } from 'redlock-universal';
import { createClient } from 'redis';

@Module({
  imports: [
    DatabaseModule,
    ClientConfigModule,
    RedlockModule.forRootAsync({
      imports: [ClientConfigModule],
      useFactory: async (config: ClientConfigService) => {
        const redisUrl = config.getRedisURL();
        const redis = createClient({ url: redisUrl });
        redis.connect();
        return {
          nodes: [new NodeRedisAdapter(redis)],
          defaultTtl: 30000, // Default lock TTL in milliseconds
          retryAttempts: 3, // Number of retry attempts
          retryDelay: 200, // Delay between retries in milliseconds
          quorum: 2, // Minimum nodes for quorum (default: majority)
          // logger: winstonLogger,    // Optional: Winston, Pino, or Bunyan logger}
        };
      },
      inject: [ClientConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ClientConfigModule],
      useFactory: async (config: ClientConfigService) => {
        const redisUrl = config.getRedisURL();
        return {
          stores: [new KeyvRedis(redisUrl)],
        };
      },
      inject: [ClientConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

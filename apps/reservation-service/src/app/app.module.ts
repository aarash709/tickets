import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '../database/database.module';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ClientsModule.register([]),
    DatabaseModule,
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

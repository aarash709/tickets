import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
  constructor(private configService: ConfigService) {}

  getRedisURL() {
    return this.configService.get<string>('REDIS_URL');
  }
  getNatsURL() {
    return this.configService.get<string>('NATS_URL');
  }

  get natsOpions(): ClientOptions {
    return {
      transport: Transport.NATS,
      options: {
        servers: this.getNatsURL(),
      },
    };
  }
}

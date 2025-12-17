import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ClientConfigService } from 'src/config/client.config.service';


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ClientConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }
  override validate(payload: {
    sub: string;
    displayName: string;
    email: string;
    role: string;
  }): unknown {
    return payload;
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ClientConfigService, secret } from '@tickets/shared';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ClientConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
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

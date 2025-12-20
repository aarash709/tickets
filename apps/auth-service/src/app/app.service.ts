import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { AuthDto } from '@tickets/shared';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtservice: JwtService,
  ) {}

  async signup(data: AuthDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const createdUser = await this.database.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return this.generateJWT({
        sub: createdUser.id.toString(),
        // displayName: createdUser.displayName,
        email: createdUser.email,
        // role: createdUser.role,
      });
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: `Internal server error!: ${error}`,
      });
    }
  }

  async login(data: AuthDto) {
    const rpcError = new RpcException({
      statusCode: 401,
      message: 'Invalid credentials!',
    });
    const user = await this.database.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      throw rpcError;
    }

    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(data.password, hashedPassword);

    if (!isPasswordValid) {
      throw rpcError;
    }
    return this.generateJWT({
      sub: user.id.toString(),
      // displayName: user.displayName,
      email: user.email,
      // role: user.role,
    });
  }

  async generateJWT(user: {
    sub: string;
    // displayName: string;
    email: string;
    // role: string;
  }) {
    const token = await this.jwtservice.signAsync(user);
    return { access_token: token };
  }

  async logout() {
    return '';
  }
}

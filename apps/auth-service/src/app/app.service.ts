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
    const userExists = await this.database.user.findUnique({
      where: { email: data.email },
    });

    if (userExists?.email === data.email)
      throw new RpcException('User already exists!');

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
  }

  async login(data: AuthDto) {
    const user = await this.database.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      throw new RpcException('Invalid credentials!');
    }

    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(data.password, hashedPassword);

    if (!isPasswordValid) {
      throw new RpcException('Invalid credentials!');
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

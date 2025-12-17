import { Body, Controller, Inject, Post } from '@nestjs/common';
import { NATSService } from '../constants';
import { ClientNats } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATSService) private natsService: ClientNats) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return await firstValueFrom(
      this.natsService.send<{ token: '' }, typeof loginDto>(
        'auth.login',
        loginDto,
      ),
    );
  }

  @Post('signup')
  async signup(@Body() signupDto: { email: string; password: string }) {
    return await firstValueFrom(
      this.natsService.send<{ token: '' }, typeof signupDto>(
        'auth.signup',
        signupDto,
      ),
    );
  }

  @Post('logout')
  async logout(@Body() signupDto: { email: string; password: string }) {
    return await firstValueFrom(
      this.natsService.send<{ token: '' }, typeof signupDto>(
        'auth.logout',
        signupDto,
      ),
    );
  }
}

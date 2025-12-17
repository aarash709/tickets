import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthDto } from '@tickets/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth.login')
  async login(@Payload() loginDto: AuthDto) {
    return this.appService.login(loginDto);
  }
  @MessagePattern('auth.signup')
  async singup(@Payload() signupDto: AuthDto) {
    return this.appService.signup(signupDto);
  }
  @MessagePattern('auth.logout')
  async logout() {
    return this.appService.logout();
  }
}

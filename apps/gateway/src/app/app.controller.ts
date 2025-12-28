import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { Role, Roles } from './guards/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { PassportJwtGuard } from './guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ description: 'Gateway test. Should return hello world!' })
  @UseGuards(PassportJwtGuard, RolesGuard)
  @Get()
  @Roles([Role.User])
  getData() {
    return this.appService.getData();
  }
}

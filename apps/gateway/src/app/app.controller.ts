import {
  Controller,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @ApiOperation({ description: 'Gateway test. Should return hello world!' })
  @Get()
  getData() {
    return this.appService.getData();
  }
}

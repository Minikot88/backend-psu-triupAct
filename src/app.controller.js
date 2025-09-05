import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor() {
    this.appService = new AppService();
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}

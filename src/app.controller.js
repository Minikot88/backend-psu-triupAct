import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller()
export class AppController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  static get parameters() {
    return [[PrismaService]];
  }

  @Get('users')
  async users() {
    return this.prisma.user.findMany();
  }
}
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller()
export class AppController {
  constructor() {
    this.prisma = new PrismaService();
  }

  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
  }
}
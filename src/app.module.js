import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AuthController } from './auth.controller.js';
import { DepartmentsController } from './departments.controller.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [],
  controllers: [AppController, AuthController, DepartmentsController],
  providers: [PrismaService],
})
export class AppModule {}

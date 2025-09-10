import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AuthController } from './auth.controller.js';
import { DepartmentsController } from './api/departments.controller.js';
import { PrismaService } from './prisma.service.js';
import { CofundersController } from './api/cofunders.controller.js';
import { FundersController } from './api/funders.controller.js';
import { AddressController } from './api/address.controller.js';
import { EducationlevelsController } from './api/educationlevels.controller.js';
import { FindingdetaillistsController } from './api/findingdetaillists.controller.js';
import { Form_allocateController } from './api/form_allocate.controller.js';
import { Form_extendController } from './api/form_extend.controller.js';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    DepartmentsController,
    CofundersController,
    FundersController,
    AddressController,
    EducationlevelsController,
    FindingdetaillistsController,
    Form_allocateController,
    Form_extendController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
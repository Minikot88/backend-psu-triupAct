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
import { Form_new_findingsController } from './api/form_new_findings.controller.js';
import { Form_research_ownerController } from './api/form_research_owner.controller.js';
import { Form_research_planController } from './api/form_research_plan.controller.js';
import { Form_utilizationController } from './api/form_utilization.controller.js';
import { GroupstudiesController } from './api/groupstudies.controller.js';
import { MainstudiesController } from './api/mainstudies.controller.js';
import { PrefixsController } from './api/prefixs.controller.js';
import { ResearcherController } from './api/researcher.controller.js';
import { RolesController } from './api/roles.controller.js';
import { SubstudiesController } from './api/substudies.controller.js';
import { Target_audiencesController } from './api/target_audiences.controller.js';
import { Time_settingsController } from './api/time_settings.controller.js';
import { UsersController } from './api/users.controller.js';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,

    AddressController,
    CofundersController,
    DepartmentsController,
    EducationlevelsController,
    FindingdetaillistsController,
    Form_allocateController,
    Form_extendController,
    Form_new_findingsController,
    Form_research_ownerController,
    Form_research_planController,
    Form_utilizationController,
    FundersController,
    GroupstudiesController,
    MainstudiesController,
    PrefixsController,
    ResearcherController,
    RolesController,
    SubstudiesController,
    Target_audiencesController,
    Time_settingsController,
    UsersController,

  ],
  providers: [PrismaService],
})
export class AppModule {}
import { AdminModule } from '@app/admin';
import { ApplicationModule } from '@app/application';
import { AuthModule } from '@app/auth';
import { KnownEntityModels } from '@app/domain';
import { ServicesModule } from '@app/services';
import { StorageModule } from '@app/storage';
import { SequelizeConfig } from '@app/utils/constants/sequelize';
import { UtilsModule } from '@app/utils/utils.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApiService } from './api.service';
import { AdminController } from './controllers/admin/admin.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { ContractsController } from './controllers/contracts/contracts.controller';
import { JobsController } from './controllers/jobs/jobs.controller';
import { BalancesController } from './controllers/balance/balances.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...SequelizeConfig,
      autoLoadModels: true,
      models: [...KnownEntityModels],
    }),
    // for now don't use ThrottlerModule, but this could be added later for rate limiting
    // ThrottlerModule.forRoot([
    //   ThrottleConfig.short,
    //   ThrottleConfig.medium,
    //   ThrottleConfig.long,
    // ]),
    CqrsModule,
    UtilsModule,
    StorageModule,
    AuthModule,
    ServicesModule,
    AdminModule,
    ApplicationModule,
  ],
  controllers: [
    AuthController,
    ContractsController,
    JobsController,
    BalancesController,
    AdminController,
  ],
  providers: [ApiService],
})
export class ApiModule {}

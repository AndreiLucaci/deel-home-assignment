import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfig } from '@app/utils/constants/sequelize';
import { KnownEntityModels } from '@app/domain';
import { AuthModule } from '@app/auth';
import { UtilsModule } from '@app/utils/utils.module';
import { ServicesModule } from '@app/services';
import { StorageModule } from '@app/storage';
import { AuthController } from './controllers/auth/auth.controller';
import { AdminController } from './controllers/admin/admin.controller';
import { AdminModule } from '@app/admin';
import { ContractsController } from './controllers/contracts/contracts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '@app/application';

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
  controllers: [AuthController, AdminController, ContractsController],
  providers: [ApiService],
})
export class ApiModule {}

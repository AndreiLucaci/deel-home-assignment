import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@app/domain';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [StorageService, UserService],
  exports: [StorageService, UserService],
})
export class StorageModule {}

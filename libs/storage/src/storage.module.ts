import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@app/domain';
import { UserService } from './user.service';
import { Profile } from '@app/domain/entities/profile.model';
import { ProfileService } from './profile.service';
import { DeelSeeder } from './seeder/deel.seeder';
import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Profile, Contract, Job])],
  providers: [StorageService, UserService, ProfileService, DeelSeeder],
  exports: [StorageService, UserService, ProfileService, DeelSeeder],
})
export class StorageModule {}

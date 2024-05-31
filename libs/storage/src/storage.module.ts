import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@app/domain';
import { UserRepository } from './repositories/user.repository';
import { Profile } from '@app/domain/entities/profile.model';
import { ProfileRepository } from './repositories/profile.repository';
import { DeelSeeder } from './seeder/deel.seeder';
import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';
import { ContractRepository } from './repositories/contract.repository';

@Module({
  imports: [SequelizeModule.forFeature([User, Profile, Contract, Job])],
  providers: [
    UserRepository,
    ProfileRepository,
    ContractRepository,
    DeelSeeder,
  ],
  exports: [UserRepository, ProfileRepository, ContractRepository, DeelSeeder],
})
export class StorageModule {}

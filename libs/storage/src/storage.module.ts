import { User } from '@app/domain';
import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';
import { Profile } from '@app/domain/entities/profile.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContractRepository } from './repositories/contract.repository';
import { JobRepository } from './repositories/job.repository';
import { ProfileRepository } from './repositories/profile.repository';
import { UserRepository } from './repositories/user.repository';
import { DeelSeeder } from './seeder/deel.seeder';

@Module({
  imports: [SequelizeModule.forFeature([User, Profile, Contract, Job])],
  providers: [
    UserRepository,
    ProfileRepository,
    ContractRepository,
    JobRepository,
    DeelSeeder,
  ],
  exports: [
    UserRepository,
    ProfileRepository,
    ContractRepository,
    JobRepository,
    DeelSeeder,
  ],
})
export class StorageModule {}

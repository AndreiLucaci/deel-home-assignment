import { KnownEntityModels } from '@app/domain';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContractRepository } from './repositories/contract.repository';
import { JobRepository } from './repositories/job.repository';
import { LedgerRepository } from './repositories/ledger.repository';
import { ProfileRepository } from './repositories/profile.repository';
import { UserRepository } from './repositories/user.repository';
import { DeelSeeder } from './seeder/deel.seeder';

@Module({
  imports: [SequelizeModule.forFeature([...KnownEntityModels])],
  providers: [
    UserRepository,
    ProfileRepository,
    ContractRepository,
    JobRepository,
    LedgerRepository,
    DeelSeeder,
  ],
  exports: [
    UserRepository,
    ProfileRepository,
    ContractRepository,
    JobRepository,
    LedgerRepository,
    DeelSeeder,
  ],
})
export class StorageModule {}

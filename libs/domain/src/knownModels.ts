import { User } from './entities';
import { Contract } from './entities/contract.model';
import { Job } from './entities/job.model';
import { Ledger } from './entities/ledger.model';
import { Profile } from './entities/profile.model';

export const KnownEntityModels = [User, Profile, Contract, Job, Ledger];

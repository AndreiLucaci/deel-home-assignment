import { Roles, User } from '@app/domain';
import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';
import { Profile, ProfileType } from '@app/domain/entities/profile.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as rawData from './data.json';
import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';
import { Ledger, LedgerType } from '@app/domain/entities/ledger.model';

type Data = {
  users: {
    id: string;
    profileId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profession: string;
    balance: number;
    type: string;
  }[];
  contracts: {
    id: string;
    terms: string;
    status: string;
    contractorId: string;
    clientId: string;
  }[];
  jobs: {
    description: string;
    price: number;
    paid: number;
    paymentDate: string;
    contractId: string;
  }[];
};

@Injectable()
export class DeelSeeder {
  #logger: Logger = new Logger(DeelSeeder.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Profile) private profileModel: typeof Profile,
    @InjectModel(Contract) private contractModel: typeof Contract,
    @InjectModel(Job) private jobModel: typeof Job,
    @InjectModel(Ledger) private ledgerModel: typeof Ledger,
  ) {}

  async seed() {
    this.#logger.debug('Seeding started');

    await this.clear();

    const data: Data = rawData;

    const results = data.users.map((x) => {
      const user = {
        id: x.id,
        email: x.email,
        password: x.password,
        name: `${x.firstName} ${x.lastName}`,
      };

      const profile = {
        id: x.profileId,
        userId: x.id,
        firstName: x.firstName,
        lastName: x.lastName,
        profession: x.profession,
        balance: x.balance,
        type: x.type,
      };

      return {
        user,
        profile,
      };
    });

    const users = await this.userModel.bulkCreate(results.map((x) => x.user));
    const profiles = await this.profileModel.bulkCreate(
      results.map((x) => x.profile),
    );
    const ledger = await this.ledgerModel.bulkCreate(
      profiles.map((x) => ({
        id: uuid(),
        holderId: x.id,
        amount: x.balance,
        fromId: null,
        toId: x.id,
        type: LedgerType.TRANSACTION,
      })),
    );
    const contracts = await this.contractModel.bulkCreate(data.contracts);
    const jobs = await this.jobModel.bulkCreate(
      data.jobs.map((x) => ({
        ...x,
        paymentDate: new Date(x.paymentDate),
        paid: Boolean(x.paid),
        id: uuid(),
      })),
    );

    this.#logger.debug(`Created ${users.length} users`);
    this.#logger.debug(`Created ${profiles.length} profiles`);
    this.#logger.debug(`Created ${contracts.length} contracts`);
    this.#logger.debug(`Created ${jobs.length} jobs`);
    this.#logger.debug(`Created ${ledger.length} ledger entries`);
    this.#logger.debug('Seeding completed');
  }

  async clear() {
    await this.ledgerModel.destroy({ where: {} });
    await this.jobModel.destroy({ where: {} });
    await this.contractModel.destroy({ where: {} });
    await this.profileModel.destroy({
      where: {
        [Op.not]: {
          type: ProfileType.OTHER,
        },
      },
    });

    await this.userModel.destroy({
      where: {
        [Op.not]: {
          role: Roles.ADMIN,
        },
      },
    });

    this.#logger.debug('Cleared all tables');
  }
}

import { Roles, User } from '@app/domain';
import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';
import { Profile, ProfileType } from '@app/domain/entities/profile.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as rawData from './data.json';
import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';

type Data = {
  users: {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profession: string;
    balance: number;
    type: string;
  }[];
  contracts: {
    id: number;
    terms: string;
    status: string;
    contractorId: number;
    clientId: number;
  }[];
  jobs: {
    description: string;
    price: number;
    paid: number;
    paymentDate: string;
    contractId: number;
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
  ) {}

  async seed() {
    this.#logger.debug('Seeding started');

    await this.clear();

    const data: Data = rawData;

    const results = data.users.map((x) => {
      const id = uuid();

      const user = {
        id,
        email: x.email,
        password: x.password,
        name: `${x.firstName} ${x.lastName}`,
      };

      const profile = {
        id: x.id,
        userId: id,
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
    const contracts = await this.contractModel.bulkCreate(data.contracts);
    const jobs = await this.jobModel.bulkCreate(
      data.jobs.map((x) => ({
        ...x,
        paymentDate: new Date(x.paymentDate),
        paid: Boolean(x.paid),
      })),
    );

    this.#logger.debug(`Created ${users.length} users`);
    this.#logger.debug(`Created ${profiles.length} profiles`);
    this.#logger.debug(`Created ${contracts.length} contracts`);
    this.#logger.debug(`Created ${jobs.length} jobs`);
    this.#logger.debug('Seeding completed');
  }

  async clear() {
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

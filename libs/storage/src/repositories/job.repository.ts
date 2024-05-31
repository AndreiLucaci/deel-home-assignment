import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';

@Injectable()
export class JobRepository {
  constructor(
    @InjectModel(Job) private jobModel: typeof Job,
    @InjectModel(Contract) private contractModel: typeof Contract,
  ) {}

  async listUnpaidJobByProfileId(profileId: string): Promise<Job[]> {
    const validContracts = await this.contractModel.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: [
          {
            clientId: profileId,
          },
          {
            contractorId: profileId,
          },
        ],
      },
      include: [
        {
          model: Job,
          where: {
            paid: {
              [Op.ne]: true,
            },
          },
        },
      ],
    });

    const jobs = validContracts.map((x) => x.jobs).flat();

    return jobs ?? [];
  }

  async sumJobPriceByClientId(
    transaction: Transaction,
    profileId: string,
  ): Promise<number> {
    const [result] = await this.contractModel.findAll<
      Contract & { totalPrice?: number }
    >({
      attributes: [
        [
          Job.sequelize.fn(
            'round',
            Job.sequelize.fn('sum', Job.sequelize.col('price')),
            2,
          ),
          'totalPrice',
        ],
      ],
      where: {
        clientId: profileId,
      },
      include: [
        {
          attributes: ['price'],
          model: Job,
          where: {
            paid: {
              [Op.ne]: true,
            },
          },
        },
      ],
      transaction,
    });

    return result?.dataValues?.totalPrice;
  }
}

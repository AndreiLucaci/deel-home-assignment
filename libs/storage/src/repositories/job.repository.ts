import { Contract } from '@app/domain/entities/contract.model';
import { Job } from '@app/domain/entities/job.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

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
}

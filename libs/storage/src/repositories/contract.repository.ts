import { Contract, ContractStatus } from '@app/domain/entities/contract.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class ContractRepository {
  constructor(@InjectModel(Contract) private contractModel: typeof Contract) {}

  public async findContractByIdAndContractorId(
    contractId: string,
    contractorId: string,
  ): Promise<Contract> {
    return this.contractModel.findOne({
      where: { id: contractId, contractorId },
    });
  }

  public async findNonTerminatedContractsByProfileId(
    profileId: string,
  ): Promise<Contract[]> {
    return this.contractModel.findAll({
      where: {
        [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
        status: {
          [Op.not]: ContractStatus.TERMINATED,
        },
      },
    });
  }
}

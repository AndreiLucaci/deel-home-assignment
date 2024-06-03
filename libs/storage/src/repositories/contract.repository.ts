import { Contract, ContractStatus } from '@app/domain/entities/contract.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';

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

  public async findNonTerminatedContractByIdTransaction(
    transaction: Transaction,
    contractId: string,
  ): Promise<Contract> {
    return this.contractModel.findOne({
      where: {
        id: contractId,
        status: { [Op.not]: ContractStatus.TERMINATED },
      },
      transaction,
    });
  }

  public async updateContractStatusByIdTransaction(
    transaction: Transaction,
    contractId: string,
    status: ContractStatus,
  ): Promise<void> {
    await this.contractModel.update(
      { status },
      { where: { id: contractId }, transaction },
    );
  }
}

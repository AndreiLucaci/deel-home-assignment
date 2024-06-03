import { ContractRepository } from '@app/storage/repositories/contract.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContractByIdQuery } from '../get-by-id.query';
import { Contract } from '@app/domain/entities/contract.model';
import { ContractNotFoundException } from '@app/exceptions/contract.exception';

@QueryHandler(GetContractByIdQuery)
export class GetContractByIdQueryHandler
  implements IQueryHandler<GetContractByIdQuery>
{
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(query: GetContractByIdQuery): Promise<Contract> {
    const { contractId, contractorId } = query;

    const result =
      await this.contractRepository.findContractByIdAndContractorId(
        contractId,
        contractorId,
      );

    if (!result) {
      throw new ContractNotFoundException();
    }

    return result;
  }
}

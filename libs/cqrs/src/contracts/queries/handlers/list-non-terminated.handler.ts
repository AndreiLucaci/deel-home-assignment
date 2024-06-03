import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListNonTerminatedContractsQuery } from '../list-non-terminated.query';
import { ContractRepository } from '@app/storage/repositories/contract.repository';
import { Contract } from '@app/domain/entities/contract.model';

@QueryHandler(ListNonTerminatedContractsQuery)
export class ListNonTerminatedContractsQueryHandler
  implements IQueryHandler<ListNonTerminatedContractsQuery>
{
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(query: ListNonTerminatedContractsQuery): Promise<Contract[]> {
    const result =
      await this.contractRepository.findNonTerminatedContractsByProfileId(
        query.profileId,
      );

    return result ?? [];
  }
}

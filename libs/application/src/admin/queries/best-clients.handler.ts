import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BestClientsQuery,
  BestClientsQueryResult,
} from '../best-clients.query';
import { LedgerRepository } from '@app/storage/repositories/ledger.repository';

@QueryHandler(BestClientsQuery)
export class BestClientsQueryHandler
  implements IQueryHandler<BestClientsQuery, BestClientsQueryResult>
{
  constructor(private readonly ledgerRepository: LedgerRepository) {}

  async execute(query: BestClientsQuery): Promise<BestClientsQueryResult> {
    const result = await this.ledgerRepository.getMostProfitableClients(
      query.startDate,
      query.endDate,
      query.limit,
    );

    return new BestClientsQueryResult(result);
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BestProfessionQuery,
  BestProfessionQueryResult,
} from '../best-profession.query';
import { LedgerRepository } from '@app/storage/repositories/ledger.repository';

@QueryHandler(BestProfessionQuery)
export class BestProfessionQueryHandler
  implements IQueryHandler<BestProfessionQuery, BestProfessionQueryResult>
{
  constructor(private readonly ledgerRepository: LedgerRepository) {}

  async execute(
    query: BestProfessionQuery,
  ): Promise<BestProfessionQueryResult> {
    const result = await this.ledgerRepository.getMostProfitableProfession(
      query.startDate,
      query.endDate,
    );

    return new BestProfessionQueryResult(result.profession, result.value);
  }
}

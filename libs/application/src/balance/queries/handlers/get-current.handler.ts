import { LedgerRepository } from '@app/storage/repositories/ledger.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Sequelize } from 'sequelize-typescript';
import {
  GetCurrentBalanceQuery,
  GetCurrentBalanceQueryResult,
} from '../get-current.query';

@QueryHandler(GetCurrentBalanceQuery)
export class GetCurrentBalanceQueryHandler
  implements
    IQueryHandler<GetCurrentBalanceQuery, GetCurrentBalanceQueryResult>
{
  constructor(
    private readonly sequelize: Sequelize,
    private readonly ledgerRepository: LedgerRepository,
  ) {}
  async execute(
    query: GetCurrentBalanceQuery,
  ): Promise<GetCurrentBalanceQueryResult> {
    const amount = await this.sequelize.transaction<number>((transaction) =>
      this.ledgerRepository.sumLedgerAmountByHolderIdTransaction(
        transaction,
        query.profileId,
      ),
    );

    return {
      amount,
      profileId: query.profileId,
    };
  }
}

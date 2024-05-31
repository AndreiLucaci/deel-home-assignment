import { LedgerRepository } from '@app/storage/repositories/ledger.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Sequelize } from 'sequelize-typescript';
import { GetCurrentBalanceQuery } from '../get-current.query';
import { CurrentBalanceResponse } from '../../balance.types';

@QueryHandler(GetCurrentBalanceQuery)
export class GetCurrentBalanceQueryHandler
  implements IQueryHandler<GetCurrentBalanceQuery>
{
  constructor(
    private readonly sequelize: Sequelize,
    private readonly ledgerRepository: LedgerRepository,
  ) {}
  async execute(
    query: GetCurrentBalanceQuery,
  ): Promise<CurrentBalanceResponse> {
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

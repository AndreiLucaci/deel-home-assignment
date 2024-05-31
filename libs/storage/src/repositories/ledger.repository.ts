import { Ledger, LedgerType } from '@app/domain/entities/ledger.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LedgerRepository {
  constructor(
    @InjectModel(Ledger) private readonly ledgerModel: typeof Ledger,
  ) {}

  async sumLedgerAmountByHolderIdTransaction(
    transaction: Transaction,
    holderId: string,
  ): Promise<number> {
    const [result] = await this.ledgerModel.findAll({
      attributes: [
        [
          this.ledgerModel.sequelize.fn(
            'round',
            this.ledgerModel.sequelize.fn(
              'sum',
              this.ledgerModel.sequelize.col('amount'),
            ),
            2,
          ),
          'amount',
        ],
      ],
      where: {
        holderId,
      },
      transaction,
    });

    return result?.amount ?? 0;
  }

  async createLedgerTransaction(
    transaction: Transaction,
    holderId: string,
    amount: number,
    fromId?: string,
  ): Promise<Ledger> {
    const newLedger = await this.ledgerModel.create(
      {
        id: uuid(),
        holderId,
        amount,
        fromId,
        type: LedgerType.TRANSACTION,
      },
      { transaction },
    );

    return newLedger;
  }
}

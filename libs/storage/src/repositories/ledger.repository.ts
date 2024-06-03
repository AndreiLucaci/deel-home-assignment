import { Ledger, LedgerType } from '@app/domain/entities/ledger.model';
import { Profile, ProfileType } from '@app/domain/entities/profile.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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
    toId?: string,
  ): Promise<Ledger> {
    const newLedger = await this.ledgerModel.create(
      {
        id: uuid(),
        holderId,
        amount,
        fromId,
        toId,
        type: LedgerType.TRANSACTION,
      },
      { transaction },
    );

    return newLedger;
  }

  async getMostProfitableProfession(
    startDate: Date,
    endDate: Date,
  ): Promise<{ profession: string; value: number }> {
    const [result] = await this.ledgerModel.findAll<Ledger>({
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
          'value',
        ],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        type: LedgerType.TRANSACTION,
        '$holder.type$': ProfileType.CONTRACTOR,
      },
      group: ['profession'],
      order: [['value', 'DESC']],
      limit: 1,
      include: [
        {
          model: Profile,
          attributes: ['profession'],
        },
      ],
    });

    return {
      profession: result.dataValues?.holder?.dataValues?.profession ?? 'Nil',
      value: result.dataValues?.value ?? 0,
    };
  }

  async getMostProfitableClients(
    startDate: Date,
    endDate: Date,
    limit: number = 2,
  ): Promise<{ fullName: string; paid: number; id: string }[]> {
    const result = await this.ledgerModel.findAll<Ledger>({
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
          'paid',
        ],
        'holderId',
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        type: LedgerType.TRANSACTION,
        '$holder.type$': ProfileType.CLIENT,
        // since these are clients, we need to "sum" the negative amounts, as they have paid for their services
        // and not mix them with their deposits
        amount: {
          [Op.lt]: 0,
        },
      },
      group: ['holderId'],
      order: [['paid', 'DESC']],
      limit,
      include: [
        {
          model: Profile,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    return result.map((item) => ({
      id: item.holder?.id,
      // since for clients these are negative values, we need to abs them
      paid: Math.abs(item.dataValues?.paid ?? 0),
      fullName: [item.holder?.firstName, item.holder?.lastName].join(' '),
    }));
  }
}

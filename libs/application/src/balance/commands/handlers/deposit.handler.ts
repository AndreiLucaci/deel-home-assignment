import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DepositBalanceCommand } from '../deposit.command';
import { LedgerRepository } from '@app/storage/repositories/ledger.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';
import { Sequelize } from 'sequelize-typescript';
import { ClientProfileNotFoundException } from '@app/exceptions/profile.exception';
import { JobRepository } from '@app/storage/repositories/job.repository';
import { DepositExceedsMaximumJobAmountException } from '@app/exceptions/balance.exception';
import { Ledger } from '@app/domain/entities/ledger.model';

@CommandHandler(DepositBalanceCommand)
export class DepositBalanceCommandHandler
  implements ICommandHandler<DepositBalanceCommand>
{
  constructor(
    private readonly sequelize: Sequelize,
    private readonly ledgerRepository: LedgerRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: DepositBalanceCommand): Promise<Ledger> {
    const profile = await this.profileRepository.findClientProfileById(
      command.profileId,
    );

    if (!profile) {
      throw new ClientProfileNotFoundException();
    }

    const ledgerTransactionResult = await this.sequelize.transaction<Ledger>(
      async (transaction) => {
        const jobAmountAtDepositTime =
          await this.jobRepository.sumJobPriceByClientId(
            transaction,
            profile.id,
          );

        if (jobAmountAtDepositTime) {
          // we check only if the client has unpaid jobs
          const maximumDepositAmount = (25 / 100) * jobAmountAtDepositTime; // 25% of the total job amount
          if (maximumDepositAmount < command.amount) {
            throw new DepositExceedsMaximumJobAmountException(
              maximumDepositAmount,
              command.amount,
            );
          }
        }

        const ledger = await this.ledgerRepository.createLedgerTransaction(
          transaction,
          profile.id,
          command.amount,
        );

        const recomputedBalanceAmount =
          await this.ledgerRepository.sumLedgerAmountByHolderIdTransaction(
            transaction,
            profile.id,
          );

        // Update the profile balance
        await this.profileRepository.updateProfileBalanceTransaction(
          transaction,
          profile.id,
          recomputedBalanceAmount,
        );

        return ledger;
      },
    );

    return ledgerTransactionResult;
  }
}

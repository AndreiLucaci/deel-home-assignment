import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PayJobCommand } from '../pay.command';
import { JobRepository } from '@app/storage/repositories/job.repository';
import { Sequelize } from 'sequelize-typescript';
import { LedgerRepository } from '@app/storage/repositories/ledger.repository';
import {
  JobAlreadyPaidException,
  JobNotFoundException,
} from '@app/exceptions/job.exception';
import { ContractRepository } from '@app/storage/repositories/contract.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';
import { ContractAlreadyTerminatedException } from '@app/exceptions/contract.exception';
import { InsufficientFundsException } from '@app/exceptions/balance.exception';
import { ContractStatus } from '@app/domain/entities/contract.model';
import { Logger } from '@nestjs/common';

@CommandHandler(PayJobCommand)
export class PayJobCommandHandler implements ICommandHandler<PayJobCommand> {
  #logger: Logger = new Logger(PayJobCommandHandler.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly jobRepository: JobRepository,
    private readonly ledgerRepository: LedgerRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly contractRepository: ContractRepository,
  ) {}

  async execute(command: PayJobCommand): Promise<void> {
    // this is still prone to race conditions, but we're trying to do our best with what we have
    await this.sequelize.transaction(async (transaction) => {
      const job = await this.jobRepository.getJobByIdAndProfileIdTransaction(
        transaction,
        command.jobId,
        command.clientId,
      );

      if (!job) {
        this.#logger.error(`Job with id ${command.jobId} not found`);
        // technically we have a guard one level up, so this should not be the problem, but still,
        // we're part of a transaction and we need to make sure that we're safely guarded
        throw new JobNotFoundException(command.jobId);
      }

      if (job.paid) {
        this.#logger.error(`Job with id ${command.jobId} already paid`);
        // we're not going to pay for the same job twice
        throw new JobAlreadyPaidException(command.jobId);
      }
      this.#logger.debug(`Paying job with id ${command.jobId}`);

      const contract =
        await this.contractRepository.findNonTerminatedContractByIdTransaction(
          transaction,
          job.contractId,
        );

      if (!contract) {
        this.#logger.error(`Contract with id ${job.contractId} not found`);
        throw new ContractAlreadyTerminatedException();
      }
      this.#logger.debug(`Contract with id ${job.contractId} found`);

      const clientBalance =
        await this.ledgerRepository.sumLedgerAmountByHolderIdTransaction(
          transaction,
          command.clientId,
        );

      if (clientBalance < job.price) {
        this.#logger.error('Insufficient funds to pay for the job');
        // again we're doing these here since we're in the same transaction
        throw new InsufficientFundsException(clientBalance, job.price);
      }
      this.#logger.debug(
        `Client with id ${command.clientId} has sufficient funds`,
      );

      await this.ledgerRepository.createLedgerTransaction(
        transaction,
        command.clientId,
        job.price * -1,
        contract.id, // we can have this as an indicator
        contract.clientId,
      );
      this.#logger.debug(
        `Client with id ${command.clientId} paid ${job.price} for job with id ${command.jobId}`,
      );

      await this.ledgerRepository.createLedgerTransaction(
        transaction,
        contract.contractorId,
        job.price,
        contract.id,
        contract.contractorId,
      );
      this.#logger.debug(
        `Contractor with id ${contract.contractorId} received ${job.price} for job with id ${command.jobId}`,
      );

      // updating the job status
      await this.jobRepository.updateJobPaidStatusTransaction(
        transaction,
        command.jobId,
        true,
      );
      this.#logger.debug(`Job with id ${command.jobId} marked as paid`);

      const unpaidJobsForContract =
        await this.jobRepository.countUnpaidJobsByContractIdTransaction(
          transaction,
          contract.id,
        );

      // we really need to check if this is 0, no funny business
      if (unpaidJobsForContract === 0) {
        this.#logger.debug(
          `All jobs for contract with id ${contract.id} are paid`,
        );
        // if we paid everything, terminate the contract
        await this.contractRepository.updateContractStatusByIdTransaction(
          transaction,
          contract.id,
          ContractStatus.TERMINATED,
        );

        this.#logger.debug(`Contract with id ${contract.id} terminated`);
      } else {
        this.#logger.debug(
          `Contract with id ${contract.id} still has unpaid jobs, skipping termination`,
        );
        if (contract.status !== ContractStatus.IN_PROGRESS) {
          // if we have transactions on this contract, make sure to put it to in_progress
          // this should already be handled by other part of the app, technically
          // granted, if we have terminated contracts with active pay, this will reopen them
          // but that's a bug, since you shouldn't have terminated contracts with unpaid jobs
          await this.contractRepository.updateContractStatusByIdTransaction(
            transaction,
            contract.id,
            ContractStatus.IN_PROGRESS,
          );
          this.#logger.debug(
            `Contract with id ${contract.id} marked as in progress`,
          );
        }
      }

      // recompute client and contractor balances
      const recomputedClientBalance =
        await this.ledgerRepository.sumLedgerAmountByHolderIdTransaction(
          transaction,
          command.clientId,
        );
      await this.profileRepository.updateProfileBalanceTransaction(
        transaction,
        command.clientId,
        recomputedClientBalance,
      );
      this.#logger.debug(
        `Client with id ${command.clientId} balance recomputed to ${recomputedClientBalance}`,
      );

      const recomputedContractorBalance =
        await this.ledgerRepository.sumLedgerAmountByHolderIdTransaction(
          transaction,
          contract.contractorId,
        );
      await this.profileRepository.updateProfileBalanceTransaction(
        transaction,
        contract.contractorId,
        recomputedContractorBalance,
      );
      this.#logger.debug(
        `Contractor with id ${contract.contractorId} balance recomputed to ${recomputedContractorBalance}`,
      );
    });
  }
}

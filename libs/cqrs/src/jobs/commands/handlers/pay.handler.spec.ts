import { ContractRepository } from '@app/storage/repositories/contract.repository';
import { JobRepository } from '@app/storage/repositories/job.repository';
import { LedgerRepository } from '@app/storage/repositories/ledger.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { Sequelize } from 'sequelize-typescript';
import { PayJobCommand } from '../pay.command';
import { PayJobCommandHandler } from './pay.handler';
import {
  JobAlreadyPaidException,
  JobNotFoundException,
} from '@app/exceptions/job.exception';
import { Job } from '@app/domain/entities/job.model';
import { ContractAlreadyTerminatedException } from '@app/exceptions/contract.exception';
import { InsufficientFundsException } from '@app/exceptions/balance.exception';
import { Contract, ContractStatus } from '@app/domain/entities/contract.model';
import { Transaction } from 'sequelize';

describe('PayHandler tests', () => {
  let commandHandler: PayJobCommandHandler;
  const sequelizeMock = mock<Sequelize>();
  const jobRepositoryMock = mock<JobRepository>();
  const contractRepositoryMock = mock<ContractRepository>();
  const ledgerRepositoryMock = mock<LedgerRepository>();
  const profileRepositoryMock = mock<ProfileRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Sequelize,
          useValue: sequelizeMock,
        },
        {
          provide: JobRepository,
          useValue: jobRepositoryMock,
        },
        {
          provide: LedgerRepository,
          useValue: ledgerRepositoryMock,
        },
        {
          provide: ProfileRepository,
          useValue: profileRepositoryMock,
        },
        {
          provide: ContractRepository,
          useValue: contractRepositoryMock,
        },
        PayJobCommandHandler,
      ],
    }).compile();

    commandHandler = module.get<PayJobCommandHandler>(PayJobCommandHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commandHandler).toBeDefined();
  });

  it('should execute the pay command in a sequelize transaction', async () => {
    // arrange
    const transactionMock = jest.fn();
    sequelizeMock.transaction.mockImplementation(transactionMock);

    const payStub: PayJobCommand = new PayJobCommand(
      'some random pay id',
      'some random profile id',
    );

    // act
    await commandHandler.execute(payStub);

    // assert
    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(transactionMock).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should throw job not found if the job does not exist', async () => {
    // arrange
    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(null);

    const payStub: PayJobCommand = new PayJobCommand(
      'some random pay id',
      'some random profile id',
    );

    // act + assert
    await expect(
      commandHandler.payJobTransaction(payStub, null),
    ).rejects.toThrow(JobNotFoundException);
  });

  it('should throw job already paid if the job is already paid', async () => {
    // arrange
    const jobMock = mock<Job>({
      paid: true,
    });
    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      'some random pay id',
      'some random profile id',
    );

    // act + assert
    await expect(
      commandHandler.payJobTransaction(payStub, null),
    ).rejects.toThrow(JobAlreadyPaidException);
  });

  it('should throw if job contract is missing or terminated', async () => {
    // arrange
    const jobMock = mock<Job>({
      paid: false,
      contractId: 'some random contract id',
    });
    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      null,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      'some random pay id',
      'some random profile id',
    );

    // act + assert
    await expect(
      commandHandler.payJobTransaction(payStub, null),
    ).rejects.toThrow(ContractAlreadyTerminatedException);
  });

  it('should throw if client has insufficient funds', async () => {
    // arrange
    const clientBalanceStub = 50;
    const jobPriceStub = 100;

    const jobMock = mock<Job>({
      paid: false,
      contractId: 'some random contract id',
      price: jobPriceStub,
    });
    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      mock(),
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValue(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      'some random pay id',
      'some random profile id',
    );

    // act + assert
    await expect(
      commandHandler.payJobTransaction(payStub, null),
    ).rejects.toThrow(InsufficientFundsException);
  });

  it('should pay the job if all conditions are met by creating two ledger entries', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const expectedClientPayingAmount = -50;
    const expectedContractorPayingAmount = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValue(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      'some random pay id',
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(ledgerRepositoryMock.createLedgerTransaction).toHaveBeenCalledTimes(
      2,
    );
    expect(ledgerRepositoryMock.createLedgerTransaction).toHaveBeenCalledWith(
      transactionMock,
      expectedClientId,
      expectedClientPayingAmount,
      expectedContractId,
      expectedClientId,
    );
    expect(ledgerRepositoryMock.createLedgerTransaction).toHaveBeenCalledWith(
      transactionMock,
      expectedContractorId,
      expectedContractorPayingAmount,
      expectedContractId,
      expectedContractorId,
    );
  });

  it('should update the job as paid after a succesfull transaction', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';
    const exactedJobId = 'some expected job id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValue(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      exactedJobId,
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(
      jobRepositoryMock.updateJobPaidStatusTransaction,
    ).toHaveBeenCalledTimes(1);
    expect(
      jobRepositoryMock.updateJobPaidStatusTransaction,
    ).toHaveBeenCalledWith(transactionMock, exactedJobId, true);
  });

  it('should update the contract status to terminated if the contract is fulfilled', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';
    const exactedJobId = 'some expected job id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );
    jobRepositoryMock.countUnpaidJobsByContractIdTransaction.mockResolvedValue(
      0,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValue(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      exactedJobId,
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(
      contractRepositoryMock.updateContractStatusByIdTransaction,
    ).toHaveBeenCalledTimes(1);

    expect(
      contractRepositoryMock.updateContractStatusByIdTransaction,
    ).toHaveBeenCalledWith(
      transactionMock,
      expectedContractId,
      ContractStatus.TERMINATED,
    );
  });

  it('should not update the contract status to in progress if the contract is in progress', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';
    const exactedJobId = 'some expected job id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
      status: ContractStatus.IN_PROGRESS,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );
    jobRepositoryMock.countUnpaidJobsByContractIdTransaction.mockResolvedValue(
      1,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValue(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      exactedJobId,
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(
      contractRepositoryMock.updateContractStatusByIdTransaction,
    ).toHaveBeenCalledTimes(0);
  });

  it('should update the contract status to in progress if the contract is not in progress (edge case)', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';
    const exactedJobId = 'some expected job id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
      status: ContractStatus.NEW,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );
    jobRepositoryMock.countUnpaidJobsByContractIdTransaction.mockResolvedValue(
      1,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValue(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      exactedJobId,
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(
      contractRepositoryMock.updateContractStatusByIdTransaction,
    ).toHaveBeenCalledTimes(1);
    expect(
      contractRepositoryMock.updateContractStatusByIdTransaction,
    ).toHaveBeenCalledWith(
      transactionMock,
      expectedContractId,
      ContractStatus.IN_PROGRESS,
    );
  });

  it('should recompute client and contractor balances after a successful transaction', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';
    const exactedJobId = 'some expected job id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
      status: ContractStatus.IN_PROGRESS,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );
    jobRepositoryMock.countUnpaidJobsByContractIdTransaction.mockResolvedValue(
      1,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValueOnce(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      exactedJobId,
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    const expectedNewClientBalance = 0;
    const expectedNewContractorBalance = 50;

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValueOnce(
      expectedNewClientBalance,
    );
    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValueOnce(
      expectedNewContractorBalance,
    );

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(
      ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction,
    ).toHaveBeenCalledTimes(3);
    expect(
      ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction,
    ).toHaveBeenCalledWith(transactionMock, expectedClientId);
    expect(
      ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction,
    ).toHaveBeenCalledWith(transactionMock, expectedContractorId);
  });

  it('should update the profile with the new recomputed balance for client and contractor', async () => {
    // arrange
    const clientBalanceStub = 100;
    const jobPriceStub = 50;

    const jobMock = mock<Job>({
      paid: false,
      price: jobPriceStub,
    });

    jobRepositoryMock.getJobByIdAndProfileIdTransaction.mockResolvedValue(
      jobMock,
    );

    const expectedContractId = 'some expected contract id';
    const expectedClientId = 'some expected client id';
    const expectedContractorId = 'some expected contractor id';
    const exactedJobId = 'some expected job id';

    const contractMock = mock<Contract>({
      id: expectedContractId,
      clientId: expectedClientId,
      contractorId: expectedContractorId,
      status: ContractStatus.IN_PROGRESS,
    });

    contractRepositoryMock.findNonTerminatedContractByIdTransaction.mockResolvedValue(
      contractMock,
    );
    jobRepositoryMock.countUnpaidJobsByContractIdTransaction.mockResolvedValue(
      1,
    );

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValueOnce(
      clientBalanceStub,
    );

    const payStub: PayJobCommand = new PayJobCommand(
      exactedJobId,
      expectedClientId,
    );

    const transactionMock = mock<Transaction>();

    const expectedNewClientBalance = 0;
    const expectedNewContractorBalance = 50;

    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValueOnce(
      expectedNewClientBalance,
    );
    ledgerRepositoryMock.sumLedgerAmountByHolderIdTransaction.mockResolvedValueOnce(
      expectedNewContractorBalance,
    );

    // act
    await commandHandler.payJobTransaction(payStub, transactionMock);

    // assert
    expect(
      profileRepositoryMock.updateProfileBalanceTransaction,
    ).toHaveBeenCalledTimes(2);
    expect(
      profileRepositoryMock.updateProfileBalanceTransaction,
    ).toHaveBeenCalledWith(
      transactionMock,
      expectedClientId,
      expectedNewClientBalance,
    );
    expect(
      profileRepositoryMock.updateProfileBalanceTransaction,
    ).toHaveBeenCalledWith(
      transactionMock,
      expectedContractorId,
      expectedNewContractorBalance,
    );
  });
});

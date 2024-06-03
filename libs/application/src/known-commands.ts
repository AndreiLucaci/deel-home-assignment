import { DepositBalanceCommandHandler } from './balance/commands/handlers/deposit.handler';
import { PayJobCommandHandler } from './jobs/commands/handlers/pay.handler';

export const KnownCommandHandlers = [
  DepositBalanceCommandHandler,
  PayJobCommandHandler,
];

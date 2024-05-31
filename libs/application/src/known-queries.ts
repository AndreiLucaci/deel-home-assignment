import { GetContractByIdQueryHandler } from './contracts/queries/handlers/get-by-id.handler';
import { ListNonTerminatedContractsQueryHandler } from './contracts/queries/handlers/list-non-terminated.handler';
import { ListUnpaidJobsQueryHandler } from './jobs/queries/handlers/list-unpaid-jobs.handler';

export const KnownQueryHandlers = [
  // contracts
  GetContractByIdQueryHandler,
  ListNonTerminatedContractsQueryHandler,

  // jobs
  ListUnpaidJobsQueryHandler,
];

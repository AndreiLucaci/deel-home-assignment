import { GetContractByIdQueryHandler } from './handlers/get-by-id.handler';
import { ListNonTerminatedContractsQueryHandler } from './handlers/list-non-terminated.handler';

export const QueryHandlers = [
  GetContractByIdQueryHandler,
  ListNonTerminatedContractsQueryHandler,
];

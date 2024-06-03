import { IQuery, IQueryResult } from '@nestjs/cqrs';

export class GetCurrentBalanceQuery implements IQuery {
  constructor(public readonly profileId: string) {}
}

export class GetCurrentBalanceQueryResult implements IQueryResult {
  constructor(
    public readonly amount: number,
    public readonly profileId: string,
  ) {}
}

import { IQuery, IQueryResult } from '@nestjs/cqrs';

export class BestClientsQuery implements IQuery {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly limit: number = 2,
  ) {}
}

export class BestClientQueryResultItem {
  constructor(
    public id: string,
    public fullName: string,
    public paid: number,
  ) {}
}

export class BestClientsQueryResult implements IQueryResult {
  constructor(public clients: BestClientQueryResultItem[]) {}
}

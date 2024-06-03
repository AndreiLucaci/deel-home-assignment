import { IQuery, IQueryResult } from '@nestjs/cqrs';

export class BestClientsQuery implements IQuery {
  constructor(
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly limit: number = 2,
  ) {}
}

export class BestClientQueryItem {
  constructor(
    public id: string,
    public fullName: string,
    public paid: number,
  ) {}
}

export class BestClientsQueryResult implements IQueryResult {
  constructor(public clients: BestClientQueryItem[]) {}
}

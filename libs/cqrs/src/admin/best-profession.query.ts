export class BestProfessionQuery {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}

export class BestProfessionQueryResult {
  constructor(
    public profession: string,
    public value: number,
  ) {}
}

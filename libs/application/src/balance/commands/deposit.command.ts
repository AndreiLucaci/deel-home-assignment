export class DepositBalanceCommand {
  constructor(
    public readonly amount: number,
    public readonly profileId: string,
  ) {}
}

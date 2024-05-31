export class GetContractByIdQuery {
  constructor(
    public readonly contractId: string,
    public readonly contractorId: string,
  ) {}
}

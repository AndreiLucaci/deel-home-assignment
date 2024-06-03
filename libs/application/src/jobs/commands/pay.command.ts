export class PayJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly clientId: string,
  ) {}
}

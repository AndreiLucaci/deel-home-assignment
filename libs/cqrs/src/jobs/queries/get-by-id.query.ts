export class GetJobByIdQuery {
  constructor(
    public readonly jobId: string,
    public readonly profileId: string,
  ) {}
}

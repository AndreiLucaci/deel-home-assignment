import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetJobByIdQuery } from '../get-by-id.query';
import { JobRepository } from '@app/storage/repositories/job.repository';
import { Job } from '@app/domain/entities/job.model';

@QueryHandler(GetJobByIdQuery)
export class GetJobByIdQueryHandler implements IQueryHandler<GetJobByIdQuery> {
  constructor(private readonly jobRepository: JobRepository) {}

  execute(query: GetJobByIdQuery): Promise<Job> {
    return this.jobRepository.getJobByIdAndProfileId(
      query.jobId,
      query.profileId,
    );
  }
}

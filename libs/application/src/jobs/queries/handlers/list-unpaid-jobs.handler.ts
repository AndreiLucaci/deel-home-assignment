import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUnpaidJobsQuery } from '../list-unpaid-jobs.query';
import { JobRepository } from '@app/storage/repositories/job.repository';

@QueryHandler(ListUnpaidJobsQuery)
export class ListUnpaidJobsQueryHandler
  implements IQueryHandler<ListUnpaidJobsQuery>
{
  constructor(private readonly jobRepository: JobRepository) {}

  execute(query: ListUnpaidJobsQuery): Promise<any> {
    return this.jobRepository.listUnpaidJobByProfileId(query.profileId);
  }
}

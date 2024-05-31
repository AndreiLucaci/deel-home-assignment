import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getUserProfileId } from '../../utils/request.utils';
import { ListUnpaidJobsQuery } from '@app/application/jobs/queries/list-unpaid-jobs.query';

@Controller('jobs')
@ApiTags('Jobs Controller')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class JobsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('unpaid')
  async listUnpaidJobs(@Request() req: Request) {
    const profileId = getUserProfileId(req);

    return this.queryBus.execute(new ListUnpaidJobsQuery(profileId));
  }
}

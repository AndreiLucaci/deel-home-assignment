import { ListUnpaidJobsQuery } from '@app/application/jobs/queries/list-unpaid-jobs.query';
import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { getUserProfileId } from '../../utils/request.utils';
import { JobResponseDto } from './jobs.responses.dto';
import { PayJobCommand } from '@app/application/jobs/commands/pay.command';
import { GetJobByIdQuery } from '@app/application/jobs/queries/get-by-id.query';
import { JobNotFoundException } from '@app/exceptions/job.exception';
import {
  GetCurrentBalanceQuery,
  GetCurrentBalanceQueryResult,
} from '@app/application/balance/queries/get-current.query';
import { InsufficientFundsException } from '@app/exceptions/balance.exception';
import { Job } from '@app/domain/entities/job.model';

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
  async listUnpaidJobs(@Request() req: Request): Promise<JobResponseDto[]> {
    const profileId = getUserProfileId(req);

    return this.queryBus.execute(new ListUnpaidJobsQuery(profileId));
  }

  @Post(':jobId/pay')
  async payJob(
    @Request() req: Request,
    @Param('jobId') jobId: string,
  ): Promise<JobResponseDto> {
    const profileId = getUserProfileId(req);

    const job = await this.queryBus.execute<GetJobByIdQuery, Job>(
      new GetJobByIdQuery(jobId, profileId),
    );

    if (!job) {
      throw new JobNotFoundException(jobId);
    }

    const currentBalance = await this.queryBus.execute<
      GetCurrentBalanceQuery,
      GetCurrentBalanceQueryResult
    >(new GetCurrentBalanceQuery(profileId));

    if (currentBalance.amount < job.price) {
      throw new InsufficientFundsException(currentBalance.amount, job.price);
    }

    await this.commandBus.execute(new PayJobCommand(jobId, profileId));

    const updatedJob = await this.queryBus.execute(
      new GetJobByIdQuery(jobId, profileId),
    );

    return updatedJob;
  }
}

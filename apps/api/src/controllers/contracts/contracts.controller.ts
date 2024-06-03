import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { getUserProfileId } from '../../utils/request.utils';
import { GetContractByIdQuery } from '@app/cqrs/contracts/queries/get-by-id.query';
import { ListNonTerminatedContractsQuery } from '@app/cqrs/contracts/queries/list-non-terminated.query';

@ApiTags('Contracts Controller')
@Controller('contracts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ContractsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':contractId')
  async getContractById(
    @Request() req: Request,
    @Param('contractId') contractId: string,
  ) {
    const contractorId = getUserProfileId(req);

    return this.queryBus.execute(
      new GetContractByIdQuery(contractId, contractorId),
    );
  }

  @Get()
  async getContracts(@Request() req: Request) {
    const contractorId = getUserProfileId(req);

    return this.queryBus.execute(
      new ListNonTerminatedContractsQuery(contractorId),
    );
  }
}

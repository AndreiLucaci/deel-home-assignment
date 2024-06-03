import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getUserProfileId } from '../../utils/request.utils';
import {
  CurrentBalanceResponseDto,
  DepositBalanceRequestDto,
} from './balance.requests.dto';
import { DepositBalanceCommand } from 'libs/cqrs/src/balance/commands/deposit.command';
import {
  GetCurrentBalanceQuery,
  GetCurrentBalanceQueryResult,
} from 'libs/cqrs/src/balance/queries/get-current.query';

@Controller('balances')
@ApiTags('Balances Controller')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class BalancesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('deposit')
  async deposit(
    @Request() req: Request,
    @Body() depositBalanceRequest: DepositBalanceRequestDto,
  ): Promise<CurrentBalanceResponseDto> {
    const profileId = getUserProfileId(req);

    await this.commandBus.execute(
      new DepositBalanceCommand(depositBalanceRequest.amount, profileId),
    );

    const result = await this.queryBus.execute<
      GetCurrentBalanceQuery,
      GetCurrentBalanceQueryResult
    >(new GetCurrentBalanceQuery(profileId));

    return result;
  }
}

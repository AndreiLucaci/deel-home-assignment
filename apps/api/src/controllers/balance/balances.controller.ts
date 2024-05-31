import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getUserProfileId } from '../../utils/request.utils';
import {
  CurrentBalanceResponseDto,
  DepositBalanceRequestDto,
} from './balance.requests.dto';
import { DepositBalanceCommand } from '@app/application/balance/commands/deposit.command';
import { GetCurrentBalanceQuery } from '@app/application/balance/queries/get-current.query';

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

    const result = this.queryBus.execute(new GetCurrentBalanceQuery(profileId));

    return result;
  }
}
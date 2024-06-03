import { GetCurrentBalanceQueryResult } from 'libs/cqrs/src/balance/queries/get-current.query';
import { IsNumber, IsPositive, NotEquals } from 'class-validator';

export class DepositBalanceRequestDto {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @NotEquals(0)
  amount: number;
}

export class CurrentBalanceResponseDto implements GetCurrentBalanceQueryResult {
  amount: number;
  profileId: string;
}

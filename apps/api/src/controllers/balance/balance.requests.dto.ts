import { CurrentBalanceResponse } from '@app/application/balance/balance.types';
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

export class CurrentBalanceResponseDto implements CurrentBalanceResponse {
  amount: number;
  profileId: string;
}

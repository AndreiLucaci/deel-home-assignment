import { UserDeleteRequest } from '@app/admin/admin.types';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class AdminCreateRequestDto
  implements
    Pick<UserCreateRequest, 'email' | 'password' | 'firstName' | 'lastName'>
{
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AdminUserDeleteRequestDto implements UserDeleteRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class DateRangeQueryDto {
  @Transform(({ value }) => {
    const intermediaryDate = new Date(value);
    const utcDate = new Date(
      Date.UTC(
        intermediaryDate.getFullYear(),
        intermediaryDate.getMonth(),
        intermediaryDate.getDate(),
        0,
        0,
        0,
        0,
      ),
    );
    return utcDate;
  })
  @IsDate()
  start: Date;

  @Transform(({ value }) => {
    const intermediaryDate = new Date(value);
    const utcDate = new Date(
      Date.UTC(
        intermediaryDate.getFullYear(),
        intermediaryDate.getMonth(),
        intermediaryDate.getDate(),
        23,
        59,
        59,
        999,
      ),
    );
    return utcDate;
  })
  @IsDate()
  end: Date;
}

export class LimitDateRangeQueryDto extends DateRangeQueryDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;
}

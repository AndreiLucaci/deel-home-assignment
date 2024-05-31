import { HttpException, HttpStatus } from '@nestjs/common';

export class DepositExceedsMaximumJobAmountException extends HttpException {
  constructor(maxAmount: number, depositAmount: number) {
    super(
      `Deposit ${depositAmount} exceeds maximum job amount to be paid (which is ${maxAmount})`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class DepositExceedsMaximumJobAmountException extends HttpException {
  constructor(maxAmount: number, depositAmount: number) {
    super(
      `Deposit ${depositAmount} exceeds maximum job amount to be paid (which is ${maxAmount})`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InsufficientFundsException extends HttpException {
  constructor(originalAmount: number, neededAmount: number) {
    super(
      `Insufficient funds: needed ${neededAmount} got only ${originalAmount}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

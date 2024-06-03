import { HttpException, HttpStatus } from '@nestjs/common';

export class ContractNotFoundException extends HttpException {
  constructor() {
    super('Contract not found', HttpStatus.NOT_FOUND);
  }
}

export class ContractAlreadyTerminatedException extends HttpException {
  constructor() {
    super('Contract already terminated', HttpStatus.BAD_REQUEST);
  }
}

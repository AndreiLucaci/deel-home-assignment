import { HttpException, HttpStatus } from '@nestjs/common';

export class ContractNotFoundException extends HttpException {
  constructor() {
    super('Contract not found', HttpStatus.NOT_FOUND);
  }
}

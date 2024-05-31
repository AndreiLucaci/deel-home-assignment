import { HttpException, HttpStatus } from '@nestjs/common';

export class ProfileNotFoundException extends HttpException {
  constructor() {
    super('Profile not found', HttpStatus.NOT_FOUND);
  }
}

export class ClientProfileNotFoundException extends HttpException {
  constructor() {
    super('Client profile not found', HttpStatus.NOT_FOUND);
  }
}

export class ContractorProfileNotFoundException extends HttpException {
  constructor() {
    super('Contractor profile not found', HttpStatus.NOT_FOUND);
  }
}

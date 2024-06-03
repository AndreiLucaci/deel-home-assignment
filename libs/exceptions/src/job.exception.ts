import { HttpException, HttpStatus } from '@nestjs/common';

export class JobNotFoundException extends HttpException {
  constructor(jobId: string) {
    super(`Job with id ${jobId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class JobAlreadyPaidException extends HttpException {
  constructor(jobId: string) {
    super(`Job with id ${jobId} already paid`, HttpStatus.BAD_REQUEST);
  }
}

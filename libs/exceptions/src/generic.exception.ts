import { HttpException } from '@nestjs/common';

export class GenericException extends HttpException {
  constructor(message?: string) {
    super(message ?? 'An error occurred', 500);
  }

  public static fromError(error: Error) {
    return new GenericException(error?.message);
  }
}

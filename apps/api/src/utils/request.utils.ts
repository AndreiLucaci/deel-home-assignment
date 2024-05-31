import { User } from '@app/domain';
import { Request } from '@nestjs/common';

export const getUserId = (req: Request): string => {
  const user: User = req['user'];

  return user.id;
};

export const getUserProfileId = (req: Request): string => {
  const user = req['user'];

  return user.profileId;
};

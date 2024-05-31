import { SetMetadata } from '@nestjs/common';
import { Roles } from '@app/domain/entities';

export const ROLES_CLAIM_KEY = 'role';
export const Claims = (...roles: Roles[]) =>
  SetMetadata(ROLES_CLAIM_KEY, roles);

import { Roles } from '@app/domain';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_CLAIM_KEY } from '../decorators/claims.decorator';

@Injectable()
export class ClaimsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // explicit role base authentication -> simplest of all
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      ROLES_CLAIM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (hasRole) {
      return true;
    }

    // potentially we'll want to extend this with a more traditional and granular claims-based approach
    // such as getting all the claims, anc checking for the claim keys and checking if they are present on the given jwt
    return false;
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const [req] = context.getArgs();
    const userRole = req?.user?.role || '';
    // NOTE: remove optional chaining after req
    const requiredRoles = this.reflector.get<Roles[]>(ROLES_KEY, context.getHandler()) || [];
    const hasAllRequiredRoles = requiredRoles.includes(userRole);

    if (requiredRoles.length === 0 || hasAllRequiredRoles) {
      return true;
    }
    throw new ForbiddenException('Not authorised');
  }
}

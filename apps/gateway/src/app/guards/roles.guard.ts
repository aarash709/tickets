import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role, Roles_Key } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.getAllAndMerge<Role[]>(Roles_Key, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = request;

    if (!roles) return true;

    return roles.some((role) => user.roles.includes(role));
  }
}

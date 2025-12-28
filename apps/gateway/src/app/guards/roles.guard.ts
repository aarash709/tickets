import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
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
    // return true;
    const user = request.user;
    if (!user) throw new UnauthorizedException('user is undefined');
    console.log(user);

    if (!roles) return true;

    console.log(roles);
    const hasRequiredRole = roles.some((role) => {
      const roleString = String(role);
      return user.role === roleString;
    });

    if (hasRequiredRole) {
      return true;
    } else {
      throw new UnauthorizedException(`Access denied`);
    }
  }
}

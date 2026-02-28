import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    // Extract user role from JWT token payload
    // The JWT payload should contain: { userId, userName, roleName }
    const userRole = request.user?.roleName;

    if (!userRole) {
      throw new ForbiddenException('Access denied. User role not found in token.');
    }

    // Case-insensitive role comparison
    const userRoleLower = userRole.toLowerCase();
    const hasRole = requiredRoles.some(role => role.toLowerCase() === userRoleLower);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${userRole}`
      );
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePolicies } from '../guard/role-policy';

@Injectable()
export class CustomRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path; // e.g., /schools
    const user = request.user; // viene del token Keycloak
    const realmRoles = user?.realm_access?.roles || [];

    // Buscar roles requeridos por módulo
    const moduleName = path.split('/')[1]; // obtiene el primer segmento, ej: 'schools'
    const requiredRoles = RolePolicies[moduleName];

    if (!requiredRoles) return true; // si no hay política definida, permitir

    // Validar intersección de roles
    const hasAccess = requiredRoles.some((role) => realmRoles.includes(role));

    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

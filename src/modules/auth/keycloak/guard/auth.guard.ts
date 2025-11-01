import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { RolePolicies } from '../guard/role-policy';

@Injectable()
export class CustomRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('No valid user found in request.');
    }

    // 🧩 Extract roles
    const realmRoles = user?.realm_access?.roles || [];
    const clientRoles = this.extractClientRoles(user);
    const allRoles = [...new Set([...realmRoles, ...clientRoles])];

    // 🧭 Extract module name from request path
    // e.g. /api/programs/list → "programs"
    const path = request.path || request.url;
    const segments = path.split('/').filter(Boolean);
    const moduleName = segments[1] || segments[0]; // Skip 'api' if exists

    console.log(
      `[Module Access Attempt] User: ${user.preferred_username}, Module: ${moduleName}, Roles: ${allRoles.join(', ')}`
    );

    // 🔒 Check role policy
    const requiredRoles = RolePolicies[moduleName];
    if (!requiredRoles) {
      console.log(`[Access Allowed] No policy for module: ${moduleName}`);
      return true;
    }

    const hasAccess = requiredRoles.some((role) => allRoles.includes(role));

    if (!hasAccess) {
      console.log(
        `[Access Denied] User roles: ${allRoles}, Required: ${requiredRoles}`
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    console.log(`[Access Granted] ${user.preferred_username} -> ${moduleName}`);
    return true;
  }

  private extractClientRoles(user: any): string[] {
    const resourceAccess = user?.resource_access || {};
    const clientRoles: string[] = [];

    Object.keys(resourceAccess).forEach((client) => {
      const roles = resourceAccess[client]?.roles || [];
      clientRoles.push(...roles.map((role) => `${client}:${role}`));
    });

    return clientRoles;
  }
}

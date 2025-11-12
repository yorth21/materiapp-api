/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('KEYCLOAK_ISSUER')}/protocol/openid-connect/certs`,
      }),
      issuer: configService.get('KEYCLOAK_ISSUER'),
      audience: configService.get('KEYCLOAK_CLIENT_ID'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // Extraemos los roles del JWT de Keycloak
    const realmRoles = payload.realm_access?.roles || [];

    // Opcional: También puedes extraer roles específicos del cliente
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    const clientRoles = payload.resource_access?.[clientId]?.roles || [];

    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: realmRoles,
    };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('KEYCLOAK_ISSUER')}/protocol/openid-connect/certs`,
      }),
      ignoreExpiration: false,
      issuer: configService.get('KEYCLOAK_ISSUER'),
      audience: 'account',
    });
  }

  async validate(payload: any) {
    const createUserDto: CreateUserDto = {
      keycloakId: payload.sub,
      email: payload.email,
      username: payload.preferred_username,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };

    const user = await this.usersService.findOrCreate(createUserDto);

    return {
      userId: user.id,
      keycloakId: user.keycloakId,
      username: user.username,
      email: user.email,
      roles: payload.realm_access?.roles || [],
    };
  }
}

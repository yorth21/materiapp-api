// keycloak.module.ts
import { Module } from '@nestjs/common';
import { KeycloakConnectModule, ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '../../../env.model';

@Module({
  imports: [
    ConfigModule,
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => ({
        authServerUrl: configService.get('KEYCLOAK_URL', { infer: true }) || 'http://localhost:8080',
        realm: configService.get('KEYCLOAK_REALM', { infer: true }) || 'materiapp-realm',
        clientId: configService.get('KEYCLOAK_CLIENT_ID', { infer: true }) || 'materiap-backend',
        secret: configService.get('KEYCLOAK_CLIENT_SECRET', { infer: true }) || '3EbgIyh8riFnyhgTkcqnU3h8bWmMbbva',
        //public: false, // ajusta según Client Authentication
        bearerOnly: true,
      }),
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakModule {}

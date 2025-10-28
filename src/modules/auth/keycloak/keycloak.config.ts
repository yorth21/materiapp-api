// import { Module } from '@nestjs/common';
// import { KeycloakConnectModule, ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';
// import { APP_GUARD } from '@nestjs/core';

// @Module({
//   imports: [
//     KeycloakConnectModule.register({
//       authServerUrl: (process.env.KEYCLOAK_URL) || 'http://localhost:8080',
//       realm: (process.env.KEYCLOAK_REALM) || 'materiapp-realm',
//       clientId: (process.env.KEYCLOAK_CLIENT_ID) || 'materiapp-client',
//       secret: (process.env.KEYCLOAK_CLIENT_SECRET) || 'ACTUAL SECRET', // Client Authentication está "On"
//      //public: true, // si Client Authentication está "Off"
//     }),
//   ],
  
// })
// export class AppModule {}

import { KeycloakConnectOptions } from 'nest-keycloak-connect';

export const keycloakConfig: KeycloakConnectOptions = {
  authServerUrl: (process.env.KEYCLOAK_URL) || 'http://localhost:8080',
  realm: (process.env.KEYCLOAK_REALM) || 'materiapp-realm',
  clientId: (process.env.KEYCLOAK_CLIENT_ID) || 'materiapp-client',
  secret: (process.env.KEYCLOAK_CLIENT_SECRET) || 'ACTUAL SECRET',
};

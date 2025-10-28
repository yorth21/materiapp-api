import { Module } from '@nestjs/common';
import { KeycloakModule } from './keycloak/keycloak.module';

@Module({
  imports: [KeycloakModule],
  exports: [KeycloakModule],
})
export class AuthModule {}

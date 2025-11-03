import { Module } from '@nestjs/common';
import { KeycloakModule } from './keycloak/keycloak.module';
import { AuthController } from './keycloak/controller/auth.controller';
import { KeycloakAdminService } from './keycloak/controller/keycloak-admin.service';

@Module({
  controllers: [AuthController],
  imports: [KeycloakModule],
  providers: [KeycloakAdminService],
  exports: [KeycloakModule, KeycloakAdminService],
})
export class AuthModule {}

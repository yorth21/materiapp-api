import { Body, Controller, Post } from '@nestjs/common';
import { KeycloakAdminService } from '../keycloak-admin.service';
import { CreateUserDto } from '../create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.keycloakAdminService.createUser(createUserDto);
    return { message: 'User created successfully', user };
  }
}

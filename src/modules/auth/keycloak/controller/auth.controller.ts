import { Body, Controller, Post } from '@nestjs/common';
import { KeycloakAdminService } from './keycloak-admin.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from 'nest-keycloak-connect';

@Controller('auth')
export class AuthController {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Public endpoint accessed: /auth/register');
    const user = await this.keycloakAdminService.createUser(createUserDto);
    return { message: 'User created successfully', user };
  }
}

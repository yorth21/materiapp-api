import { Controller, Get, Post, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { IUser } from '../auth/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Roles('admin', 'student')
  async getMyInfo(@CurrentUser() keycloakUser: IUser) {
    const user = await this.usersService.findByKeycloakId(keycloakUser.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post('register-me')
  @Roles('admin', 'student')
  async registerMe(@CurrentUser() keycloakUser: IUser) {
    const existingUser = await this.usersService.findByKeycloakId(
      keycloakUser.userId,
    );

    if (existingUser) {
      return existingUser;
    }

    const createUserDto: CreateUserDto = {
      keycloakId: keycloakUser.userId,
      email: keycloakUser.email,
      username: keycloakUser.username,
    };

    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  async findAll() {
    return await this.usersService.findAll();
  }
}

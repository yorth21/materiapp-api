import { Controller, Get, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/current-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Roles('admin', 'student')
  async getMyInfo(@CurrentUser() currentUser: ICurrentUser) {
    const user = await this.usersService.findByKeycloakId(
      currentUser.keycloakId,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  @Roles('admin')
  async findAll() {
    return await this.usersService.findAll();
  }
}

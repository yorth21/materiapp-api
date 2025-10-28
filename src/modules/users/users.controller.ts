import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser, Public, Roles } from 'nest-keycloak-connect';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles({ roles: ['realm:admin'] })
  findAll() {
    return 'This action returns all users';
  }

  // @Get()
  // @Roles({ roles: ['admin'] })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  @Roles({ roles: ['admin', 'user'] })
  findOne(@Param('id') id: string, @AuthenticatedUser() user:any) {
    console.log('Authenticated user:', user);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles({ roles: ['admin'] })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles({ roles: ['admin'] })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

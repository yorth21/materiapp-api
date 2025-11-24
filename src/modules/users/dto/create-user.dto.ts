import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  keycloakId: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;
}

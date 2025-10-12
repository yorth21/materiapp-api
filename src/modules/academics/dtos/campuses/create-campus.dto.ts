import { IsString, Length } from 'class-validator';

export class CreateCampusDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 100)
  city: string;

  @IsString()
  @Length(1, 255)
  address: string;
}

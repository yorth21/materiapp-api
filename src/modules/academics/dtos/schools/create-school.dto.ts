import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 50)
  code: string;

  @IsInt()
  @IsNotEmpty()
  campusId: number;
}

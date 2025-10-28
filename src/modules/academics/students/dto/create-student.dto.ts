import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @Length(1, 16)
  code: string;

  @IsString()
  @Length(1, 255)
  names: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  email?: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsInt()
  @Min(1)
  semester: number;
}

import { IsString, Length } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @Length(1, 20)
  code: string;

  @IsString()
  @Length(1, 255)
  name: string;
}

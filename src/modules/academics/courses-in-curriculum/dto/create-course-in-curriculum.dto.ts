import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseInCurriculumDto {
  @IsInt()
  @IsNotEmpty()
  semester: number;

  @IsString()
  @IsIn(['A', 'B'])
  @IsOptional()
  calendar?: string;

  @IsInt()
  @IsNotEmpty()
  credits: number;

  @IsInt()
  @IsNotEmpty()
  curriculumId: number;

  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

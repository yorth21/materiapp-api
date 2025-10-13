import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCoursePrerequisiteDto {
  @IsInt()
  @IsNotEmpty()
  courseInCurriculumId: number;

  @IsInt()
  @IsNotEmpty()
  prerequisiteCicId: number;
}

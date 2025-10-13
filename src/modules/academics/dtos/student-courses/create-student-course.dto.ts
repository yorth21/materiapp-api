import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateStudentCourseDto {
  @IsInt()
  @IsNotEmpty()
  studentCurriculumId: number;

  @IsInt()
  @IsNotEmpty()
  courseInCurriculumId: number;
}

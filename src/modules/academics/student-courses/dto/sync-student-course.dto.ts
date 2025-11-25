import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class SyncStudentCourseDto {
  @IsInt()
  @IsNotEmpty()
  studentCurriculumId: number;

  @IsInt()
  @IsNotEmpty()
  courseInCurriculumId: number;

  @IsBoolean()
  isApproved: boolean;
}

import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateStudentCurriculumDto {
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsNumber()
  curriculumId: number;
}

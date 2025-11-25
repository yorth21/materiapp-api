import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateStudentCurriculumDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  curriculumId: number;
}

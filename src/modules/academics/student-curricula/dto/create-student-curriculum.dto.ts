import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateStudentCurriculumDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(20)
  semester: number;

  @IsNotEmpty()
  @IsNumber()
  curriculumId: number;
}

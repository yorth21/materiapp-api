import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentCurriculumDto } from './create-student-curriculum.dto';

export class UpdateStudentCurriculumDto extends PartialType(
  CreateStudentCurriculumDto,
) {}

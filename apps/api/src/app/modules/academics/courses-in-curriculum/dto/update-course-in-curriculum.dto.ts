import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseInCurriculumDto } from './create-course-in-curriculum.dto';

export class UpdateCourseInCurriculumDto extends PartialType(
  CreateCourseInCurriculumDto,
) {}

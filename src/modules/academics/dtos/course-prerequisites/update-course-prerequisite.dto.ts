import { PartialType } from '@nestjs/mapped-types';
import { CreateCoursePrerequisiteDto } from './create-course-prerequisite.dto';

export class UpdateCoursePrerequisiteDto extends PartialType(
  CreateCoursePrerequisiteDto,
) {}

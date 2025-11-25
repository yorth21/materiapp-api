import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentCurriculumRecommendationDto } from './create-student-curriculum-recommendation.dto';

export class UpdateStudentCurriculumRecommendationDto extends PartialType(CreateStudentCurriculumRecommendationDto) {}

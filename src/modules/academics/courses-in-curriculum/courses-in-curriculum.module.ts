import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesInCurriculumService } from './courses-in-curriculum.service';
import { CoursesInCurriculumController } from './courses-in-curriculum.controller';
import { CourseInCurriculum } from '../../../entities/course-in-curriculum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseInCurriculum])],
  controllers: [CoursesInCurriculumController],
  providers: [CoursesInCurriculumService],
})
export class CoursesInCurriculumModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecomendationsService } from './recomendations.service';
import { RecomendationsController } from './recomendations.controller';

import { StudentCurriculum } from '../../../entities/student-curriculum.entity';
import { StudentCourse } from '../../../entities/student-course.entity';
import { CourseInCurriculum } from '../../../entities/course-in-curriculum.entity';
import { Course } from '../../../entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentCurriculum,
      StudentCourse,
      CourseInCurriculum,
      Course,
    ]),
  ],
  controllers: [RecomendationsController],
  providers: [RecomendationsService],
})
export class RecomendationsModule {}

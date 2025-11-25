import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentCoursesService } from './student-courses.service';
import { StudentCoursesController } from './student-courses.controller';
import { StudentCourse } from 'src/entities/student-course.entity';
import { StudentCurriculum } from 'src/entities/student-curriculum.entity';
import { CourseInCurriculum } from 'src/entities/course-in-curriculum.entity';
import { StudentCurriculaModule } from '../student-curricula/student-curricula.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentCourse,
      StudentCurriculum,
      CourseInCurriculum,
    ]),
    StudentCurriculaModule,
  ],
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
})
export class StudentCoursesModule {}

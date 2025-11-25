import { Module } from '@nestjs/common';

import { CampusesModule } from './campuses/campuses.module';
import { CoursesInCurriculumModule } from './courses-in-curriculum/courses-in-curriculum.module';
import { CoursesModule } from './courses/courses.module';
import { CurriculaModule } from './curricula/curricula.module';
import { ProgramsModule } from './programs/programs.module';
import { SchoolsModule } from './schools/schools.module';
import { StudentCoursesModule } from './student-courses/student-courses.module';
import { StudentCurriculaModule } from './student-curricula/student-curricula.module';

@Module({
  imports: [
    CampusesModule,
    CoursesInCurriculumModule,
    CoursesModule,
    CurriculaModule,
    ProgramsModule,
    SchoolsModule,
    StudentCoursesModule,
    StudentCurriculaModule,
  ],
})
export class AcademicsModule {}

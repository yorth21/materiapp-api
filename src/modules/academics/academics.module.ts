import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { Campus } from './entities/campus.entity';
import { Program } from './entities/program.entity';
import { School } from './entities/school.entity';
import { Student } from './entities/student.entity';
import { Curriculum } from './entities/curriculum.entity';
import { Course } from './entities/course.entity';
import { CourseInCurriculum } from './entities/course-in-curriculum.entity';
import { CoursePrerequisite } from './entities/course-prerequisite.entity';
import { StudentCurriculum } from './entities/student-curriculum.entity';
import { StudentCourse } from './entities/student-course.entity';

// Controllers
import { CampusesController } from './controllers/campuses.controller';
import { ProgramsController } from './controllers/programs.controller';
import { SchoolsController } from './controllers/schools.controller';
import { StudentsController } from './controllers/students.controller';
import { CurriculaController } from './controllers/curricula.controller';
import { CoursesController } from './controllers/courses.controller';

// Services
import { CampusesService } from './services/campuses.service';
import { ProgramsService } from './services/programs.service';
import { SchoolsService } from './services/schools.service';
import { StudentsService } from './services/students.service';
import { CurriculaService } from './services/curricula.service';
import { CoursesService } from './services/courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campus,
      Program,
      School,
      Student,
      Curriculum,
      Course,
      CourseInCurriculum,
      CoursePrerequisite,
      StudentCurriculum,
      StudentCourse,
    ]),
  ],
  controllers: [
    CampusesController,
    ProgramsController,
    SchoolsController,
    StudentsController,
    CurriculaController,
    CoursesController,
  ],
  providers: [
    CampusesService,
    ProgramsService,
    SchoolsService,
    StudentsService,
    CurriculaService,
    CoursesService,
  ],
})
export class AcademicsModule {}

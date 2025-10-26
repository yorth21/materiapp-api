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
import { StudentCurriculum } from './entities/student-curriculum.entity';
import { StudentCourse } from './entities/student-course.entity';

// Controllers
import { CampusesController } from './controllers/campuses.controller';
import { ProgramsController } from './controllers/programs.controller';
import { SchoolsController } from './controllers/schools.controller';
import { StudentsController } from './controllers/students.controller';
import { CurriculaController } from './controllers/curricula.controller';
import { CoursesController } from './controllers/courses.controller';
import { CoursesInCurriculumController } from './controllers/courses-in-curriculum.controller';
import { StudentCoursesController } from './controllers/student-courses.controller';
import { StudentCurriculaController } from './controllers/student-curricula.controller';

// Services
import { CampusesService } from './services/campuses.service';
import { ProgramsService } from './services/programs.service';
import { SchoolsService } from './services/schools.service';
import { StudentsService } from './services/students.service';
import { CurriculaService } from './services/curricula.service';
import { CoursesService } from './services/courses.service';
import { CoursesInCurriculumService } from './services/courses-in-curriculum.service';
import { StudentCoursesService } from './services/student-courses.service';
import { StudentCurriculaService } from './services/student-curricula.service';

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
    CoursesInCurriculumController,
    StudentCoursesController,
    StudentCurriculaController,
  ],
  providers: [
    CampusesService,
    ProgramsService,
    SchoolsService,
    StudentsService,
    CurriculaService,
    CoursesService,
    CoursesInCurriculumService,
    StudentCoursesService,
    StudentCurriculaService,
  ],
})
export class AcademicsModule {}

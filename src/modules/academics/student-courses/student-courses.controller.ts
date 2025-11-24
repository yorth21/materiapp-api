import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentCoursesService } from '../student-courses/student-courses.service';
import { CreateStudentCourseDto } from './dto/create-student-course.dto';
import { UpdateStudentCourseDto } from './dto/update-student-course.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  @Roles('admin', 'student')
  create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }

  @Get()
  @Roles('admin', 'student')
  findAll() {
    return this.studentCoursesService.findAll();
  }

  @Get('student-curriculum/:studentCurriculumId')
  @Roles('admin', 'student')
  findByStudentCurriculumId(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
  ) {
    return this.studentCoursesService.findByStudentCurriculumId(
      studentCurriculumId,
    );
  }

  @Get(':studentCurriculumId/:courseInCurriculumId')
  @Roles('admin', 'student')
  findOne(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
    @Param('courseInCurriculumId', ParseIntPipe) courseInCurriculumId: number,
  ) {
    return this.studentCoursesService.findOne(
      studentCurriculumId,
      courseInCurriculumId,
    );
  }

  @Patch(':studentCurriculumId/:courseInCurriculumId')
  @Roles('admin', 'student')
  update(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
    @Param('courseInCurriculumId', ParseIntPipe) courseInCurriculumId: number,
    @Body() updateStudentCourseDto: UpdateStudentCourseDto,
  ) {
    return this.studentCoursesService.update(
      studentCurriculumId,
      courseInCurriculumId,
      updateStudentCourseDto,
    );
  }

  @Delete(':studentCurriculumId/:courseInCurriculumId')
  @Roles('admin', 'student')
  remove(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
    @Param('courseInCurriculumId', ParseIntPipe) courseInCurriculumId: number,
  ) {
    return this.studentCoursesService.remove(
      studentCurriculumId,
      courseInCurriculumId,
    );
  }
}

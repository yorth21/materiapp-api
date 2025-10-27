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

@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }

  @Get()
  findAll() {
    return this.studentCoursesService.findAll();
  }

  @Get('student-curriculum/:studentCurriculumId')
  findByStudentCurriculumId(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
  ) {
    return this.studentCoursesService.findByStudentCurriculumId(
      studentCurriculumId,
    );
  }

  @Get(':studentCurriculumId/:courseInCurriculumId')
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

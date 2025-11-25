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
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { SyncStudentCourseDto } from './dto/sync-student-course.dto';

@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  @Roles('admin', 'student')
  create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }

  @Post('approve-or-unapprove')
  @Roles('admin', 'student')
  sync(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() syncStudentCourseDto: SyncStudentCourseDto,
  ) {
    return this.studentCoursesService.approveOrUnapproveCourse(
      syncStudentCourseDto,
      currentUser.userId,
    );
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.studentCoursesService.findAll();
  }

  @Get('me/student-curricula/:studentCurriculumId')
  @Roles('student')
  findMyByStudentCurriculumId(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
  ) {
    return this.studentCoursesService.findByStudentCurriculumIdAndUserId(
      studentCurriculumId,
      currentUser.userId,
    );
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

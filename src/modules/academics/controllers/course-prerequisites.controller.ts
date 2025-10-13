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
import { CoursePrerequisitesService } from '../services/course-prerequisites.service';
import { CreateCoursePrerequisiteDto } from '../dtos/course-prerequisites/create-course-prerequisite.dto';
import { UpdateCoursePrerequisiteDto } from '../dtos/course-prerequisites/update-course-prerequisite.dto';

@Controller('course-prerequisites')
export class CoursePrerequisitesController {
  constructor(
    private readonly coursePrerequisitesService: CoursePrerequisitesService,
  ) {}

  @Post()
  create(@Body() createCoursePrerequisiteDto: CreateCoursePrerequisiteDto) {
    return this.coursePrerequisitesService.create(createCoursePrerequisiteDto);
  }

  @Get()
  findAll() {
    return this.coursePrerequisitesService.findAll();
  }

  @Get(':courseInCurriculumId/course-in-curriculum')
  findInCurriculum(
    @Param('courseInCurriculumId', ParseIntPipe) courseInCurriculumId: number,
  ) {
    return this.coursePrerequisitesService.findByCourseInCurriculumId(
      courseInCurriculumId,
    );
  }

  @Patch(':courseInCurriculumId/:prerequisiteCicId')
  update(
    @Param('courseInCurriculumId', ParseIntPipe) courseInCurriculumId: number,
    @Param('prerequisiteCicId', ParseIntPipe) prerequisiteCicId: number,
    @Body() updateCoursePrerequisiteDto: UpdateCoursePrerequisiteDto,
  ) {
    return this.coursePrerequisitesService.update(
      courseInCurriculumId,
      prerequisiteCicId,
      updateCoursePrerequisiteDto,
    );
  }

  @Delete(':courseInCurriculumId/:prerequisiteCicId')
  remove(
    @Param('courseInCurriculumId', ParseIntPipe) courseInCurriculumId: number,
    @Param('prerequisiteCicId', ParseIntPipe) prerequisiteCicId: number,
  ) {
    return this.coursePrerequisitesService.remove(
      courseInCurriculumId,
      prerequisiteCicId,
    );
  }
}

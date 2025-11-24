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
import { CoursesInCurriculumService } from '../courses-in-curriculum/courses-in-curriculum.service';
import { CreateCourseInCurriculumDto } from './dto/create-course-in-curriculum.dto';
import { UpdateCourseInCurriculumDto } from './dto/update-course-in-curriculum.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('courses-in-curriculum')
export class CoursesInCurriculumController {
  constructor(
    private readonly coursesInCurriculumService: CoursesInCurriculumService,
  ) {}

  @Post()
  @Roles('admin')
  create(@Body() createCourseInCurriculumDto: CreateCourseInCurriculumDto) {
    return this.coursesInCurriculumService.create(createCourseInCurriculumDto);
  }

  @Get()
  @Roles('admin', 'student')
  findAll() {
    return this.coursesInCurriculumService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'student')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesInCurriculumService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseInCurriculumDto: UpdateCourseInCurriculumDto,
  ) {
    return this.coursesInCurriculumService.update(
      id,
      updateCourseInCurriculumDto,
    );
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesInCurriculumService.remove(id);
  }
}

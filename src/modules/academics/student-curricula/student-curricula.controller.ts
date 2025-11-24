import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { StudentCurriculaService } from '../student-curricula/student-curricula.service';
import { CreateStudentCurriculumDto } from './dto/create-student-curriculum.dto';
import { UpdateStudentCurriculumDto } from './dto/update-student-curriculum.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('student-curricula')
export class StudentCurriculaController {
  constructor(
    private readonly studentCurriculaService: StudentCurriculaService,
  ) {}

  @Post()
  @Roles('admin', 'student')
  async create(@Body() createStudentCurriculumDto: CreateStudentCurriculumDto) {
    return this.studentCurriculaService.create(createStudentCurriculumDto);
  }

  @Get()
  @Roles('admin', 'student')
  async findAll() {
    return this.studentCurriculaService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'student')
  async findOne(@Param('id') id: number) {
    return this.studentCurriculaService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'student')
  async update(
    @Param('id') id: number,
    @Body() updateStudentCurriculumDto: UpdateStudentCurriculumDto,
  ) {
    return this.studentCurriculaService.update(id, updateStudentCurriculumDto);
  }

  @Delete(':id')
  @Roles('admin', 'student')
  async remove(@Param('id') id: number) {
    return this.studentCurriculaService.remove(id);
  }
}

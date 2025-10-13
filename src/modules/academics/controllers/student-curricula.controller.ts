import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { StudentCurriculaService } from '../services/student-curricula.service';
import { CreateStudentCurriculumDto } from '../dtos/student-curricula/create-student-curriculum.dto';
import { UpdateStudentCurriculumDto } from '../dtos/student-curricula/update-student-curriculum.dto';

@Controller('student-curricula')
export class StudentCurriculaController {
  constructor(
    private readonly studentCurriculaService: StudentCurriculaService,
  ) {}

  @Post()
  async create(@Body() createStudentCurriculumDto: CreateStudentCurriculumDto) {
    return this.studentCurriculaService.create(createStudentCurriculumDto);
  }

  @Get()
  async findAll() {
    return this.studentCurriculaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.studentCurriculaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStudentCurriculumDto: UpdateStudentCurriculumDto,
  ) {
    return this.studentCurriculaService.update(id, updateStudentCurriculumDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.studentCurriculaService.remove(id);
  }
}

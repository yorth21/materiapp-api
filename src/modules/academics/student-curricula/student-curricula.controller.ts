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
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';

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

  @Post('me')
  @Roles('admin', 'student')
  async createByMe(
    @Body() createStudentCurriculumDto: CreateStudentCurriculumDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.studentCurriculaService.create({
      ...createStudentCurriculumDto,
      userId: currentUser.userId,
    });
  }

  @Get()
  @Roles('admin')
  async findAll() {
    return this.studentCurriculaService.findAll();
  }

  @Get('me')
  @Roles('admin', 'student')
  async findByMe(@CurrentUser() currentUser: ICurrentUser) {
    return this.studentCurriculaService.findByUserId(currentUser.userId);
  }

  @Get('me/:id')
  @Roles('admin', 'student')
  async findOneByMe(
    @Param('id') id: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.studentCurriculaService.findOneByUserId(id, currentUser.userId);
  }

  @Get(':id')
  @Roles('admin')
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

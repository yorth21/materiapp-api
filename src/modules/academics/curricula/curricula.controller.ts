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
import { CurriculaService } from '../curricula/curricula.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('curricula')
export class CurriculaController {
  constructor(private readonly curriculaService: CurriculaService) {}

  @Post()
  @Roles('admin')
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculaService.create(createCurriculumDto);
  }

  @Get()
  @Roles('admin', 'student')
  findAll() {
    return this.curriculaService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'student')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.curriculaService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
  ) {
    return this.curriculaService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.curriculaService.remove(id);
  }
}

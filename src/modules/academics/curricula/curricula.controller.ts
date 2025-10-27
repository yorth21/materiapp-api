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

@Controller('curricula')
export class CurriculaController {
  constructor(private readonly curriculaService: CurriculaService) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculaService.create(createCurriculumDto);
  }

  @Get()
  findAll() {
    return this.curriculaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.curriculaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
  ) {
    return this.curriculaService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.curriculaService.remove(id);
  }
}

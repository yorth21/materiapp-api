import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('campuses')
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Post()
  @Roles('admin')
  create(@Body() createCampusDto: CreateCampusDto) {
    return this.campusesService.create(createCampusDto);
  }

  @Get()
  @Roles('admin', 'student')
  findAll() {
    return this.campusesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'student')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campusesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampusDto: UpdateCampusDto,
  ) {
    return this.campusesService.update(id, updateCampusDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.campusesService.softDelete(id);
  }
}

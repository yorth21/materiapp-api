import { Injectable } from '@nestjs/common';
import { CreateCampusDto } from '../dtos/campuses/create-campus.dto';
import { UpdateCampusDto } from '../dtos/campuses/update-campus.dto';

@Injectable()
export class CampusesService {
  create(createCampusDto: CreateCampusDto) {
    return 'This action adds a new campus';
  }

  findAll() {
    return `This action returns all campuses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} campus`;
  }

  update(id: number, updateCampusDto: UpdateCampusDto) {
    return `This action updates a #${id} campus`;
  }

  remove(id: number) {
    return `This action removes a #${id} campus`;
  }
}

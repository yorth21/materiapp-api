import { Injectable } from '@nestjs/common';
import { CreateCampusDto } from '../dtos/campuses/create-campus.dto';
import { UpdateCampusDto } from '../dtos/campuses/update-campus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from '../entities/campus.entity';

@Injectable()
export class CampusesService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async create(createCampusDto: CreateCampusDto): Promise<Campus> {
    const campus = this.campusRepository.create(createCampusDto);
    return this.campusRepository.save(campus);
  }

  async findAll(): Promise<Campus[]> {
    return this.campusRepository.find();
  }

  async findOne(id: number): Promise<Campus | null> {
    return this.campusRepository.findOneBy({ id });
  }

  async update(id: number, updateCampusDto: UpdateCampusDto): Promise<void> {
    await this.campusRepository.update(id, updateCampusDto);
  }

  async remove(id: number): Promise<void> {
    await this.campusRepository.delete(id);
  }
}

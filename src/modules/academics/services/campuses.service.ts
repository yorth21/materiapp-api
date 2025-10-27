import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.campusRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Campus | null> {
    return this.campusRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: number, updateCampusDto: UpdateCampusDto): Promise<Campus> {
    await this.campusRepository.update(id, updateCampusDto);
    const updated = await this.campusRepository.findOneBy({ id });
    if (!updated) {
      throw new NotFoundException('Campus not found');
    }

    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await this.campusRepository.update(id, { isActive: false });
  }
}

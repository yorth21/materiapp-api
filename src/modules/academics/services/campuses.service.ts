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

  async findOne(id: number): Promise<Campus> {
    return this.findById(id);
  }

  async update(id: number, updateCampusDto: UpdateCampusDto): Promise<Campus> {
    await this.campusRepository.update(id, updateCampusDto);
    return this.findById(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.campusRepository.update(id, { isActive: false });
  }

  private async findById(id: number): Promise<Campus> {
    const campus = await this.campusRepository.findOne({
      where: { id, isActive: true },
    });
    if (!campus) {
      throw new NotFoundException('Campus not found');
    }
    return campus;
  }
}

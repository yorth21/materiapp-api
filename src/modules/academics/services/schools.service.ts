import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from '../dtos/schools/create-school.dto';
import { UpdateSchoolDto } from '../dtos/schools/update-school.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from '../entities/school.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = this.schoolsRepository.create(createSchoolDto);
    return this.schoolsRepository.save({
      ...school,
      campus: { id: createSchoolDto.campusId },
    });
  }

  async findAll(): Promise<School[]> {
    return this.schoolsRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<School> {
    return this.findById(id);
  }
  async update(id: number, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    await this.schoolsRepository.update(id, updateSchoolDto);
    return this.findById(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.schoolsRepository.update(id, { isActive: false });
  }

  private async findById(id: number): Promise<School> {
    const school = await this.schoolsRepository.findOne({
      where: { id, isActive: true },
    });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }
}

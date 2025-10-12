import { Injectable } from '@nestjs/common';
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
    return this.schoolsRepository.find();
  }

  async findOne(id: number): Promise<School | null> {
    return this.schoolsRepository.findOneBy({ id });
  }
  async update(id: number, updateSchoolDto: UpdateSchoolDto): Promise<void> {
    await this.schoolsRepository.update(id, updateSchoolDto);
  }

  async remove(id: number): Promise<void> {
    await this.schoolsRepository.delete(id);
  }
}

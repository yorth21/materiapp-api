import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curriculum } from '../../../entities/curriculum.entity';
import { Repository } from 'typeorm';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@Injectable()
export class CurriculaService {
  constructor(
    @InjectRepository(Curriculum)
    private curriculaRepository: Repository<Curriculum>,
  ) {}

  async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    const curriculum = this.curriculaRepository.create(createCurriculumDto);

    console.log(createCurriculumDto);

    return this.curriculaRepository.save({
      ...curriculum,
      createdAt: createCurriculumDto.createdAt || new Date(),
      program: { id: createCurriculumDto.programId },
    });
  }

  async findAll(): Promise<Curriculum[]> {
    return this.curriculaRepository.find();
  }

  async findOne(id: number): Promise<Curriculum | null> {
    return this.curriculaRepository.findOne({
      where: { id },
      relations: ['program'],
    });
  }

  async update(
    id: number,
    updateCurriculumDto: UpdateCurriculumDto,
  ): Promise<void> {
    const { programId, ...updateData } = updateCurriculumDto;

    if (programId) {
      await this.curriculaRepository.update(id, {
        ...updateData,
        program: { id: programId },
      });
    } else {
      await this.curriculaRepository.update(id, updateData);
    }
  }

  async remove(id: number): Promise<void> {
    await this.curriculaRepository.delete(id);
  }
}

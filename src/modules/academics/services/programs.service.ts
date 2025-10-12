import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from '../dtos/programs/create-program.dto';
import { UpdateProgramDto } from '../dtos/programs/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from '../entities/program.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private programsRepository: Repository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const program = this.programsRepository.create(createProgramDto);
    return this.programsRepository.save({
      ...program,
      school: { id: createProgramDto.schoolId },
    });
  }

  async findAll(): Promise<Program[]> {
    return this.programsRepository.find();
  }

  async findOne(id: number): Promise<Program | null> {
    return this.programsRepository.findOne({
      where: { id },
      relations: ['school'],
    });
  }

  async update(id: number, updateProgramDto: UpdateProgramDto): Promise<void> {
    await this.programsRepository.update(id, updateProgramDto);
  }

  async remove(id: number): Promise<void> {
    await this.programsRepository.delete(id);
  }
}

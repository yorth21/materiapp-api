import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCurriculum } from '../../../entities/student-curriculum.entity';
import { CreateStudentCurriculumDto } from './dto/create-student-curriculum.dto';
import { UpdateStudentCurriculumDto } from './dto/update-student-curriculum.dto';

@Injectable()
export class StudentCurriculaService {
  constructor(
    @InjectRepository(StudentCurriculum)
    private readonly studentCurriculumRepository: Repository<StudentCurriculum>,
  ) {}

  async create(
    createStudentCurriculumDto: CreateStudentCurriculumDto,
  ): Promise<StudentCurriculum> {
    const studentCurriculum = this.studentCurriculumRepository.create({
      ...createStudentCurriculumDto,
      user: { id: createStudentCurriculumDto.userId },
      curriculum: { id: createStudentCurriculumDto.curriculumId },
    });
    return this.studentCurriculumRepository.save(studentCurriculum);
  }

  async findAll(): Promise<StudentCurriculum[]> {
    return this.studentCurriculumRepository.find({
      relations: ['user', 'curriculum', 'studentCourses'],
    });
  }

  async findOne(id: number): Promise<StudentCurriculum> {
    const studentCurriculum = await this.studentCurriculumRepository.findOne({
      where: { id },
      relations: ['user', 'curriculum', 'studentCourses'],
    });
    if (!studentCurriculum) {
      throw new NotFoundException(`StudentCurriculum with ID ${id} not found`);
    }
    return studentCurriculum;
  }

  async update(
    id: number,
    updateStudentCurriculumDto: UpdateStudentCurriculumDto,
  ): Promise<void> {
    await this.studentCurriculumRepository.update(
      id,
      updateStudentCurriculumDto,
    );
  }

  async remove(id: number): Promise<void> {
    const studentCurriculum = await this.findOne(id);
    await this.studentCurriculumRepository.remove(studentCurriculum);
  }
}

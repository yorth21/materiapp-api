import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurriculumProgressView } from '../entities/curriculum-progress.view';
import { Repository } from 'typeorm';

@Injectable()
export class CurriculumProgressService {
  constructor(
    @InjectRepository(CurriculumProgressView)
    private curriculumProgressRepository: Repository<CurriculumProgressView>,
  ) {}

  async getProgressByStudentId(
    studentId: string,
  ): Promise<CurriculumProgressView[]> {
    return this.curriculumProgressRepository.find({
      where: { studentId },
    });
  }
}

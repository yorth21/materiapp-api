import { Injectable } from '@nestjs/common';
import { StudentCoursesService } from 'src/modules/academics/student-courses/student-courses.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCurriculumRecommendation } from 'src/entities/student-curriculum-recommendation.entity';

@Injectable()
export class StudentCurriculumRecommendationsService {
  @InjectRepository(StudentCurriculumRecommendation)
  private studentCurriculumRecomendation: Repository<StudentCurriculumRecommendation>;

  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  async getLastValidRecommendation(
    studentCurriculumId: number,
  ): Promise<StudentCurriculumRecommendation | null> {
    const lastChange =
      await this.studentCoursesService.findByStudentCurriculumIdLastChange(
        studentCurriculumId,
      );

    if (!lastChange) return null;

    const lastRecommendation =
      await this.getLastRecommendation(studentCurriculumId);

    if (
      lastRecommendation &&
      lastRecommendation.createdAt > lastChange.createdAt
    ) {
      return lastRecommendation;
    }

    return null;
  }

  async create(
    studentCurriculumId: number,
    payload: string,
  ): Promise<StudentCurriculumRecommendation> {
    const recommendation = this.studentCurriculumRecomendation.create({
      studentCurriculum: { id: studentCurriculumId },
      payload,
    });

    return await this.studentCurriculumRecomendation.save(recommendation);
  }

  private async getLastRecommendation(studentCurriculumId: number) {
    return await this.studentCurriculumRecomendation.findOne({
      where: { studentCurriculum: { id: studentCurriculumId } },
      order: { createdAt: 'DESC' },
    });
  }
}

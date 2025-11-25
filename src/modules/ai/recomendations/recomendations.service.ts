import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';
import { StudentCourse } from '../../../entities/student-course.entity';
import { CourseInCurriculum } from '../../../entities/course-in-curriculum.entity';
import {
  CompletedCourseInfo,
  CourseRecommendationRequest,
  CourseRecommendationResponse,
  CoursesByCode,
  CurriculumCourseInfo,
  GeneratedRecommendation,
} from './dto';
import { StudentCurriculum } from '../../../entities/student-curriculum.entity';
import { PROMPT_RECOMMENDATIONS } from './const';
import { StudentCurriculumRecommendationsService } from '../student-curriculum-recommendations/student-curriculum-recommendations.service';

@Injectable()
export class RecomendationsService {
  constructor(
    @InjectRepository(StudentCurriculum)
    private readonly studentCurriculumRepository: Repository<StudentCurriculum>,
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
    @InjectRepository(CourseInCurriculum)
    private readonly courseInCurriculumRepository: Repository<CourseInCurriculum>,
    private readonly openaiService: OpenaiService,
    private readonly studentCurriculumRecommendationsService: StudentCurriculumRecommendationsService,
  ) {}

  async generateRecomendation(
    studentCurriculumId: number,
  ): Promise<GeneratedRecommendation> {
    const studentCurriculum = await this.studentCurriculumRepository.findOne({
      where: { id: studentCurriculumId },
    });

    if (!studentCurriculum) {
      throw new NotFoundException('Student curriculum not found');
    }

    let recommendationResponse: string = '';
    const lastValidRecommendation =
      await this.studentCurriculumRecommendationsService.getLastValidRecommendation(
        studentCurriculumId,
      );

    if (lastValidRecommendation) {
      console.log('✅ Using cached recommendation \n');
      recommendationResponse = lastValidRecommendation.payload;
    } else {
      console.log('✅ Generating new recommendation from AI \n');
      recommendationResponse =
        await this.getRecommendationFromAi(studentCurriculum);

      await this.studentCurriculumRecommendationsService.create(
        studentCurriculumId,
        recommendationResponse,
      );
    }

    const validatedResponse = this.responseToValidatedFormat(
      recommendationResponse,
    );

    const courses = await this.getCoursesByCodes(validatedResponse.recommended);

    return {
      courses,
      rationale: validatedResponse.why,
    };
  }

  private async getRecommendationFromAi(
    studentCurriculum: StudentCurriculum,
  ): Promise<string> {
    const completedCourses = await this.getCompletedCourses(
      studentCurriculum.id,
    );

    const curriculumCourses = await this.getCurriculumCourses(
      studentCurriculum.curriculumId,
    );

    const requestPayload: CourseRecommendationRequest = {
      params: {
        term: 'A',
        currentSemester: 8,
        maxCourses: 7,
        minCourses: 5,
      },
      pensum: curriculumCourses,
      approvedCourses: completedCourses.map((course) => course.id),
    };

    const response = await this.openaiService.ask(
      JSON.stringify(requestPayload),
      PROMPT_RECOMMENDATIONS,
    );

    if (!response) {
      throw new BadRequestException('No response received from AI service');
    }

    return response;
  }

  private async getCompletedCourses(
    studentCurriculumId: number,
  ): Promise<CompletedCourseInfo[]> {
    return await this.studentCourseRepository
      .createQueryBuilder('sc')
      .select(['c.code as id'])
      .innerJoin('sc.courseInCurriculum', 'cic')
      .innerJoin('cic.course', 'c')
      .where('sc.student_curriculum_id = :studentCurriculumId', {
        studentCurriculumId,
      })
      .getRawMany();
  }

  private async getCurriculumCourses(
    curriculumId: number,
  ): Promise<CurriculumCourseInfo[]> {
    return await this.courseInCurriculumRepository
      .createQueryBuilder('cic')
      .select([
        'c.code as id',
        'cic.credits as cr',
        'cic.semester as sem',
        'TRIM(cic.calendar) as cal',
        'cpre.code as pre',
      ])
      .innerJoin('cic.course', 'c')
      .leftJoin('cic.prerequisite', 'cpre')
      .where('cic.curriculum_id = :curriculumId', { curriculumId })
      .getRawMany();
  }

  private responseToValidatedFormat(
    response: string | null,
  ): CourseRecommendationResponse {
    if (!response) {
      throw new BadRequestException(
        'No response received from AI service. Please try again.',
      );
    }

    try {
      const parsedResponse = JSON.parse(
        response,
      ) as CourseRecommendationResponse;

      // Validar que la respuesta tiene la estructura esperada
      if (
        !parsedResponse.recommended ||
        !Array.isArray(parsedResponse.recommended)
      ) {
        throw new BadRequestException(
          'Invalid AI response format: missing or invalid recommended courses array',
        );
      }

      if (!parsedResponse.why || typeof parsedResponse.why !== 'string') {
        throw new BadRequestException(
          'Invalid AI response format: missing or invalid rationale explanation',
        );
      }

      return parsedResponse;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException(
          `AI service returned invalid JSON format: ${error.message}`,
        );
      }
      throw error;
    }
  }

  private getCoursesByCodes(courseCodes: string[]): Promise<CoursesByCode[]> {
    return this.courseInCurriculumRepository
      .createQueryBuilder('cic')
      .select([
        'cic.id as id',
        'c.code as code',
        'c.name as name',
        'cic.credits as credits',
        'cic.semester as semester',
        'TRIM(cic.calendar) as calendar',
      ])
      .innerJoin('cic.course', 'c')
      .where('c.code IN (:...courseCodes)', { courseCodes })
      .getRawMany();
  }
}

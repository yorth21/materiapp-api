import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { AiRecommendationService } from './ai-recommendation.service';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { RecommendationResponse } from './interfaces/recommendation.interface';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiRecommendationService: AiRecommendationService,
  ) {}

  @Get('recommendations/:studentId')
  async getRecommendations(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query() queryParams: GetRecommendationsDto,
  ): Promise<RecommendationResponse> {
    try {
      return await this.aiRecommendationService.getRecommendations(studentId, {
        currentSemester: queryParams.currentSemester,
        maxCredits: queryParams.maxCredits,
        preferredSchedule: queryParams.preferredSchedule,
        includeElectives: queryParams.includeElectives,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'Error generating recommendations for student',
      );
    }
  }

  @Get('progress/:studentId')
  async getAcademicProgress(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    try {
      const recommendations =
        await this.aiRecommendationService.getRecommendations(studentId, {
          currentSemester: 'A', // Valor por defecto
        });
      return {
        academicProgress: recommendations.academicProgress,
        totalCreditsCompleted:
          recommendations.academicProgress.completionPercentage,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error fetching academic progress');
    }
  }
}

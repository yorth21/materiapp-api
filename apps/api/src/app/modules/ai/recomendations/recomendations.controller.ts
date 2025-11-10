import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RecomendationsService } from './recomendations.service';

@Controller('recomendations')
export class RecomendationsController {
  constructor(private readonly recomendationsService: RecomendationsService) {}

  @Get('generate-recomendation/:studentCurriculumId')
  generateRecomendation(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number
  ) {
    return this.recomendationsService.generateRecomendation(
      studentCurriculumId
    );
  }
}

import { Body, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RecomendationsService } from './recomendations.service';
import { Public } from 'nest-keycloak-connect';

@Controller('recomendations')
export class RecomendationsController {
  constructor(private readonly recomendationsService: RecomendationsService) {}

  @Get('generate-recomendation/:studentCurriculumId')
  @Public()
  generateRecomendation(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
  ) {
    return this.recomendationsService.generateRecomendation(
      studentCurriculumId,
    );
  }
}

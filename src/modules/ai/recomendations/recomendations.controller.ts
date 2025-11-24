import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RecomendationsService } from './recomendations.service';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('recomendations')
export class RecomendationsController {
  constructor(private readonly recomendationsService: RecomendationsService) {}

  @Get('generate-recomendation/:studentCurriculumId')
  @Roles('student', 'admin')
  generateRecomendation(
    @Param('studentCurriculumId', ParseIntPipe) studentCurriculumId: number,
  ) {
    return this.recomendationsService.generateRecomendation(
      studentCurriculumId,
    );
  }
}

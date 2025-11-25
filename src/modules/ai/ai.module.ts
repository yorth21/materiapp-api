import { Module } from '@nestjs/common';

import { RecomendationsModule } from './recomendations/recomendations.module';
import { OpenaiModule } from './openai/openai.module';
import { StudentCurriculumRecommendationsModule } from './student-curriculum-recommendations/student-curriculum-recommendations.module';

@Module({
  imports: [
    RecomendationsModule,
    OpenaiModule,
    StudentCurriculumRecommendationsModule,
  ],
})
export class AiModule {}

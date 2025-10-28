import { Module } from '@nestjs/common';

import { RecomendationsModule } from './recomendations/recomendations.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [RecomendationsModule, OpenaiModule],
})
export class AiModule {}

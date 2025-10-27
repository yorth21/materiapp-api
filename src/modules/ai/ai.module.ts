import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AiController } from './ai.controller';
import { AiRecommendationService } from './ai-recommendation.service';

// Importar las entidades necesarias
import { Student } from '../../entities/student.entity';
import { StudentCurriculum } from '../../entities/student-curriculum.entity';
import { StudentCourse } from '../../entities/student-course.entity';
import { CourseInCurriculum } from '../../entities/course-in-curriculum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      StudentCurriculum,
      StudentCourse,
      CourseInCurriculum,
    ]),
    ConfigModule,
  ],
  controllers: [AiController],
  providers: [AiRecommendationService],
  exports: [AiRecommendationService],
})
export class AiModule {}

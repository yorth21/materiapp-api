import { Module } from '@nestjs/common';
import { StudentCurriculumRecommendationsService } from './student-curriculum-recommendations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCurriculumRecommendation } from 'src/entities/student-curriculum-recommendation.entity';
import { StudentCoursesModule } from '../../academics/student-courses/student-courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCurriculumRecommendation]),
    StudentCoursesModule,
  ],
  controllers: [],
  providers: [StudentCurriculumRecommendationsService],
  exports: [StudentCurriculumRecommendationsService],
})
export class StudentCurriculumRecommendationsModule {}

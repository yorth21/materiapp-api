import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentCurriculaService } from './student-curricula.service';
import { StudentCurriculaController } from './student-curricula.controller';
import { StudentCurriculum } from '../../../entities/student-curriculum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCurriculum])],
  controllers: [StudentCurriculaController],
  providers: [StudentCurriculaService],
  exports: [StudentCurriculaService],
})
export class StudentCurriculaModule {}

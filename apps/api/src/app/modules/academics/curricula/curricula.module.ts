import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurriculaService } from './curricula.service';
import { CurriculaController } from './curricula.controller';
import { Curriculum } from '../../../entities/curriculum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curriculum])],
  controllers: [CurriculaController],
  providers: [CurriculaService],
})
export class CurriculaModule {}

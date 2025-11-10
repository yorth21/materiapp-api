import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakModule } from '../../auth/keycloak/keycloak.module';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { School } from '../../../entities/school.entity';

@Module({
  imports: [KeycloakModule,TypeOrmModule.forFeature([School])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}

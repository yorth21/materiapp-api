import { Module } from '@nestjs/common';
import { AcademicsModule } from './modules/academics/academics.module';
import { AiModule } from './modules/ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    AcademicsModule,
    AiModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AcademicsModule } from './modules/academics/academics.module';
import { AiModule } from './modules/ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: false,
    }),
    AcademicsModule,
    AiModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}

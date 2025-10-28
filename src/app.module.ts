import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './env.model';
import { UsersModule } from './modules/users/users.module';
import { AcademicsModule } from './modules/academics/academics.module';
import { AuthGuard, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Env>) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', { infer: true }),
        port: configService.get('POSTGRES_PORT', { infer: true }),
        username: configService.get('POSTGRES_USER', { infer: true }),
        password: configService.get('POSTGRES_PASSWORD', { infer: true }),
        database: configService.get('POSTGRES_DB', { infer: true }),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    // KeycloakConnectModule.registerAsync({
    //   useFactory: (configService: ConfigService<Env>) => ({
    //     authServerUrl: configService.get('KEYCLOAK_URL', { infer: true })! ,
    //     realm: configService.get('KEYCLOAK_REALM', { infer: true })!,
    //     clientId: configService.get('KEYCLOAK_CLIENT_ID', { infer: true })! ,
    //     secret: configService.get('KEYCLOAK_CLIENT_SECRET', { infer: true })!,
    //     public: false,
    //   }),
    //   inject: [ConfigService],
    // }),

    UsersModule,
    AcademicsModule,
    AuthModule,
    AiModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions-filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: () => {
        return new BadRequestException({
          message: 'Validation failed',
        });
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');

  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

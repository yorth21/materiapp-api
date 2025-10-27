import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Student } from '../../entities/student.entity';
import { StudentCurriculum } from '../../entities/student-curriculum.entity';
import { StudentCourse } from '../../entities/student-course.entity';
import { CourseInCurriculum } from '../../entities/course-in-curriculum.entity';
import { Env } from '../../env.model';

import {
  RecommendationResponse,
  CourseRecommendation,
  StudentAcademicProgress,
  CompletedCourse,
  CurriculumInfo,
  RecommendationRequest,
} from './interfaces/recommendation.interface';

@Injectable()
export class AiRecommendationService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(StudentCurriculum)
    private studentCurriculumRepository: Repository<StudentCurriculum>,
    @InjectRepository(StudentCourse)
    private studentCourseRepository: Repository<StudentCourse>,
    @InjectRepository(CourseInCurriculum)
    private courseInCurriculumRepository: Repository<CourseInCurriculum>,
    private configService: ConfigService<Env>,
  ) {}

  async getRecommendations(
    studentId: string,
    request: RecommendationRequest,
  ): Promise<RecommendationResponse> {
    // 1. Obtener información académica del estudiante
    const academicProgress = await this.getStudentAcademicProgress(studentId);

    // 2. Obtener todas las materias del pensum
    const allCurriculumCourses = await this.getAllCurriculumCourses(
      academicProgress.currentCurriculum.curriculumId,
    );

    // 3. Filtrar materias disponibles para matrícula
    const availableCourses = this.getAvailableCourses(
      allCurriculumCourses,
      academicProgress.completedCourses,
      request.currentSemester,
    );

    // 4. Generar recomendaciones usando lógica de negocio
    const recommendations = this.generateRecommendations(
      academicProgress,
      availableCourses,
      request,
    );

    // 5. Calcular métricas de progreso
    const progressMetrics = this.calculateProgressMetrics(academicProgress);

    return {
      recommendations: recommendations.recommendations,
      totalRecommendedCredits: recommendations.totalCredits,
      academicProgress: progressMetrics,
      analysis: recommendations.analysis,
      warnings: recommendations.warnings,
    };
  }

  private async getStudentAcademicProgress(
    studentId: string,
  ): Promise<StudentAcademicProgress> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['studentCurricula'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const activeStudentCurriculum =
      await this.studentCurriculumRepository.findOne({
        where: { studentId, isActive: true },
        relations: ['curriculum', 'curriculum.program', 'studentCourses'],
      });

    if (!activeStudentCurriculum) {
      throw new NotFoundException(
        `No active curriculum found for student ${studentId}`,
      );
    }

    const completedCourses = await this.studentCourseRepository.find({
      where: { studentCurriculumId: activeStudentCurriculum.id },
      relations: ['courseInCurriculum', 'courseInCurriculum.course'],
    });

    const mappedCompletedCourses: CompletedCourse[] = completedCourses.map(
      (sc) => ({
        courseId: sc.courseInCurriculum.courseId,
        courseCode: sc.courseInCurriculum.course.code,
        courseName: sc.courseInCurriculum.course.name,
        semester: sc.courseInCurriculum.semester,
        credits: sc.courseInCurriculum.credits,
        completedAt: sc.createdAt,
      }),
    );

    // Calcular total de créditos del currículo
    const totalCreditsResult = await this.courseInCurriculumRepository
      .createQueryBuilder('cic')
      .select('SUM(cic.credits)', 'total')
      .where('cic.curriculumId = :curriculumId', {
        curriculumId: activeStudentCurriculum.curriculumId,
      })
      .getRawOne();

    const totalCreditsCompleted = mappedCompletedCourses.reduce(
      (sum, course) => sum + course.credits,
      0,
    );

    const curriculumInfo: CurriculumInfo = {
      curriculumId: activeStudentCurriculum.curriculum.id,
      version: activeStudentCurriculum.curriculum.version,
      programName: activeStudentCurriculum.curriculum.program.name,
      totalSemesters: 10, // Ingeniería de Sistemas normalmente son 10 semestres
      totalCredits: parseInt(totalCreditsResult?.total as string) || 0,
    };

    return {
      studentId,
      currentSemester: student.semester,
      totalCreditsCompleted,
      totalCreditsRequired: curriculumInfo.totalCredits,
      completedCourses: mappedCompletedCourses,
      currentCurriculum: curriculumInfo,
    };
  }

  private async getAllCurriculumCourses(
    curriculumId: number,
  ): Promise<CourseInCurriculum[]> {
    return this.courseInCurriculumRepository.find({
      where: { curriculumId, isActive: true },
      relations: ['course', 'prerequisite'],
    });
  }

  private getAvailableCourses(
    allCourses: CourseInCurriculum[],
    completedCourses: CompletedCourse[],
    currentSemester: string,
  ): CourseInCurriculum[] {
    const completedCourseIds = new Set(
      completedCourses.map((course) => course.courseId),
    );

    return allCourses.filter((course) => {
      // No incluir materias ya cursadas
      if (completedCourseIds.has(course.courseId)) {
        return false;
      }

      // Filtrar por calendario (si la materia tiene calendario específico)
      if (course.calendar && course.calendar !== currentSemester) {
        return false;
      }

      // Verificar prerrequisitos
      if (course.prerequisiteId) {
        return completedCourseIds.has(course.prerequisiteId);
      }

      return true;
    });
  }

  private generateRecommendations(
    academicProgress: StudentAcademicProgress,
    availableCourses: CourseInCurriculum[],
    request: RecommendationRequest,
  ): {
    recommendations: CourseRecommendation[];
    totalCredits: number;
    analysis: string;
    warnings: string[];
  } {
    const recommendations: CourseRecommendation[] = [];
    const warnings: string[] = [];
    let totalCredits = 0;
    const maxCredits = request.maxCredits || 18;

    // Ordenar cursos por semestre y prioridad
    const sortedCourses = [...availableCourses].sort((a, b) => {
      // Priorizar materias del semestre actual del estudiante
      const aIsCurrentSemester =
        a.semester === academicProgress.currentSemester;
      const bIsCurrentSemester =
        b.semester === academicProgress.currentSemester;

      if (aIsCurrentSemester && !bIsCurrentSemester) return -1;
      if (!aIsCurrentSemester && bIsCurrentSemester) return 1;

      // Luego por semestre
      if (a.semester !== b.semester) {
        return a.semester - b.semester;
      }

      // Finalmente por créditos (materias con menos créditos primero para optimizar)
      return a.credits - b.credits;
    });

    // Seleccionar materias respetando el límite de créditos
    for (const course of sortedCourses) {
      if (totalCredits + course.credits <= maxCredits) {
        let priority: 'high' | 'medium' | 'low' = 'medium';
        let reason = '';

        // Determinar prioridad y razón
        if (course.semester === academicProgress.currentSemester) {
          priority = 'high';
          reason = `Materia del semestre ${course.semester}, ideal para tu nivel académico actual.`;
        } else if (course.semester < academicProgress.currentSemester) {
          priority = 'high';
          reason = `Materia atrasada del semestre ${course.semester}, importante para recuperar el ritmo académico.`;
        } else if (course.semester === academicProgress.currentSemester + 1) {
          priority = 'medium';
          reason = `Materia del siguiente semestre, te ayudará a avanzar en la carrera.`;
        } else {
          priority = 'low';
          reason = `Materia avanzada del semestre ${course.semester}, considera tomarla más adelante.`;
        }

        // Casos especiales
        if (course.credits >= 4) {
          reason += ' Es una materia de alta carga académica.';
        }

        if (course.calendar) {
          reason += ` Solo se dicta en semestre ${course.calendar}.`;
        }

        recommendations.push({
          courseId: course.courseId,
          courseCode: course.course.code,
          courseName: course.course.name,
          semester: course.semester,
          credits: course.credits,
          calendar: course.calendar,
          priority,
          reason,
          canEnroll: true,
        });

        totalCredits += course.credits;
      }
    }

    // Generar análisis
    let analysis = `Basado en tu progreso académico actual (${academicProgress.totalCreditsCompleted}/${academicProgress.totalCreditsRequired} créditos completados), `;

    if (recommendations.length === 0) {
      analysis +=
        'no hay materias disponibles para matricular en este momento. Verifica que hayas completado todos los prerrequisitos necesarios.';
      warnings.push('No se encontraron materias disponibles para matricular.');
    } else {
      analysis += `se recomienda matricular ${recommendations.length} materias por un total de ${totalCredits} créditos. `;

      const highPriorityCount = recommendations.filter(
        (r) => r.priority === 'high',
      ).length;
      if (highPriorityCount > 0) {
        analysis += `${highPriorityCount} de estas materias son de alta prioridad. `;
      }

      // Advertencias
      if (totalCredits > 20) {
        warnings.push(
          'La carga académica recomendada excede los 20 créditos. Considera reducir el número de materias.',
        );
      }

      if (
        recommendations.some(
          (r) => r.semester > academicProgress.currentSemester + 1,
        )
      ) {
        warnings.push(
          'Algunas materias recomendadas están muy adelantadas a tu semestre actual.',
        );
      }
    }

    return {
      recommendations,
      totalCredits,
      analysis,
      warnings,
    };
  }

  private calculateProgressMetrics(academicProgress: StudentAcademicProgress): {
    completionPercentage: number;
    semestersRemaining: number;
    onTrack: boolean;
  } {
    const completionPercentage =
      (academicProgress.totalCreditsCompleted /
        academicProgress.totalCreditsRequired) *
      100;

    const expectedSemester = Math.ceil(
      (academicProgress.totalCreditsCompleted /
        academicProgress.totalCreditsRequired) *
        academicProgress.currentCurriculum.totalSemesters,
    );

    const onTrack = academicProgress.currentSemester <= expectedSemester + 1;

    const creditsRemaining =
      academicProgress.totalCreditsRequired -
      academicProgress.totalCreditsCompleted;
    const averageCreditsPerSemester = 18;
    const semestersRemaining = Math.ceil(
      creditsRemaining / averageCreditsPerSemester,
    );

    return {
      completionPercentage: Math.round(completionPercentage * 100) / 100,
      semestersRemaining,
      onTrack,
    };
  }
}

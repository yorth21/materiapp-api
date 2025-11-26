import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from 'src/entities/student-course.entity';
import { CreateStudentCourseDto } from './dto/create-student-course.dto';
import { UpdateStudentCourseDto } from './dto/update-student-course.dto';
import { CourseInCurriculum } from 'src/entities/course-in-curriculum.entity';
import { StudentCurriculaService } from '../student-curricula/student-curricula.service';
import { SyncStudentCourseDto } from './dto/sync-student-course.dto';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private studentCoursesRepository: Repository<StudentCourse>,

    @InjectRepository(CourseInCurriculum)
    private courseInCurriculumsRepository: Repository<CourseInCurriculum>,

    private readonly studentCurriculaService: StudentCurriculaService,
  ) {}

  async create(
    createStudentCourseDto: CreateStudentCourseDto,
  ): Promise<StudentCourse> {
    const studentCourse = this.studentCoursesRepository.create({
      ...createStudentCourseDto,
      studentCurriculum: { id: createStudentCourseDto.studentCurriculumId },
      courseInCurriculum: { id: createStudentCourseDto.courseInCurriculumId },
    });
    return this.studentCoursesRepository.save(studentCourse);
  }

  async approveOrUnapproveCourse(
    syncStudentCourseDto: SyncStudentCourseDto,
    userId: string,
  ): Promise<void> {
    const studentCurriculum = await this.studentCurriculaService.findOne(
      syncStudentCourseDto.studentCurriculumId,
    );

    if (studentCurriculum.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resource.');
    }

    const belongs = await this.courseInCurriculumsRepository.existsBy({
      id: syncStudentCourseDto.courseInCurriculumId,
      curriculum: { id: studentCurriculum.curriculumId },
    });

    if (!belongs) {
      throw new BadRequestException(
        'Course does not belong to this curriculum.',
      );
    }

    if (!syncStudentCourseDto.isApproved) {
      await this.studentCoursesRepository.delete({
        studentCurriculumId: syncStudentCourseDto.studentCurriculumId,
        courseInCurriculumId: syncStudentCourseDto.courseInCurriculumId,
      });
      return;
    }

    await this.studentCoursesRepository.upsert(
      {
        studentCurriculumId: syncStudentCourseDto.studentCurriculumId,
        courseInCurriculumId: syncStudentCourseDto.courseInCurriculumId,
      },
      {
        conflictPaths: ['studentCurriculumId', 'courseInCurriculumId'],
      },
    );
  }

  async findAll(): Promise<StudentCourse[]> {
    return this.studentCoursesRepository.find();
  }

  async findByStudentCurriculumIdAndUserId(
    studentCurriculumId: number,
    userId: string,
  ): Promise<any> {
    const studentCurriculum =
      await this.studentCurriculaService.findOne(studentCurriculumId);

    if (studentCurriculum.userId !== userId) {
      throw new BadRequestException('Access denied for this user.');
    }

    return this.courseInCurriculumsRepository
      .createQueryBuilder('cic')
      .select([
        'cic.id as id',
        'c.name as name',
        'c.code as code',
        'cic.semester as semester',
        'cic.calendar as calendar',
        'cic.type as type',
        'cic.credits as credits',
      ])
      .addSelect(
        `
          CASE 
            WHEN sc.course_in_curriculum_id IS NULL THEN false 
            ELSE true 
          END`,
        'isApproved',
      )
      .innerJoin('cic.course', 'c')
      .leftJoin(
        'cic.studentCourses',
        'sc',
        'cic.id = sc.course_in_curriculum_id',
      )
      .where('cic.curriculum_id = :curriculumId', {
        curriculumId: studentCurriculum.curriculumId,
      })
      .getRawMany();
  }

  async findByStudentCurriculumId(
    studentCurriculumId: number,
  ): Promise<StudentCourse[]> {
    return this.studentCoursesRepository.find({
      where: { studentCurriculum: { id: studentCurriculumId } },
      relations: ['studentCurriculum', 'courseInCurriculum'],
    });
  }

  async findByStudentCurriculumIdLastChange(
    studentCurriculumId: number,
  ): Promise<StudentCourse | null> {
    return this.studentCoursesRepository.findOne({
      where: { studentCurriculum: { id: studentCurriculumId } },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(
    studentCurriculumId: number,
    courseInCurriculumId: number,
  ): Promise<StudentCourse | null> {
    return this.studentCoursesRepository.findOne({
      where: { studentCurriculumId, courseInCurriculumId },
      relations: ['studentCurriculum', 'courseInCurriculum'],
    });
  }

  async update(
    studentCurriculumId: number,
    courseInCurriculumId: number,
    updateStudentCourseDto: UpdateStudentCourseDto,
  ): Promise<void> {
    await this.studentCoursesRepository.update(
      { studentCurriculumId, courseInCurriculumId },
      updateStudentCourseDto,
    );
  }

  async remove(
    studentCurriculumId: number,
    courseInCurriculumId: number,
  ): Promise<void> {
    await this.studentCoursesRepository.delete({
      studentCurriculumId,
      courseInCurriculumId,
    });
  }
}

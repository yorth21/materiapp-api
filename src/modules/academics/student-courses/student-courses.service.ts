import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from 'src/entities/student-course.entity';
import { CreateStudentCourseDto } from './dto/create-student-course.dto';
import { UpdateStudentCourseDto } from './dto/update-student-course.dto';
import { StudentCurriculum } from 'src/entities/student-curriculum.entity';
import { CourseInCurriculum } from 'src/entities/course-in-curriculum.entity';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private studentCoursesRepository: Repository<StudentCourse>,

    @InjectRepository(StudentCurriculum)
    private studentCurriculumsRepository: Repository<StudentCurriculum>,

    @InjectRepository(CourseInCurriculum)
    private courseInCurriculumsRepository: Repository<CourseInCurriculum>,
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

  async findAll(): Promise<StudentCourse[]> {
    return this.studentCoursesRepository.find();
  }

  async findByStudentCurriculumIdAndUserId(
    studentCurriculumId: number,
    userId: string,
  ): Promise<any> {
    const studentCurriculum = await this.studentCurriculumsRepository.findOne({
      where: { id: studentCurriculumId },
    });

    if (!studentCurriculum || studentCurriculum.userId !== userId) {
      throw new NotFoundException('Student curriculum not found');
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
        'isAproved',
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

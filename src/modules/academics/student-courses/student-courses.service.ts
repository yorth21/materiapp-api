import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from '../../../entities/student-course.entity';
import { CreateStudentCourseDto } from './dto/create-student-course.dto';
import { UpdateStudentCourseDto } from './dto/update-student-course.dto';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private studentCoursesRepository: Repository<StudentCourse>,
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

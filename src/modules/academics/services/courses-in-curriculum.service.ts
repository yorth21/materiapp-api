import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseInCurriculum } from '../entities/course-in-curriculum.entity';
import { CreateCourseInCurriculumDto } from '../dtos/courses-in-curriculum/create-course-in-curriculum.dto';
import { UpdateCourseInCurriculumDto } from '../dtos/courses-in-curriculum/update-course-in-curriculum.dto';
import { Curriculum } from '../entities/curriculum.entity';
import { Course } from '../entities/course.entity';

@Injectable()
export class CoursesInCurriculumService {
  constructor(
    @InjectRepository(CourseInCurriculum)
    private coursesInCurriculumRepository: Repository<CourseInCurriculum>,
  ) {}

  async create(
    createCourseInCurriculumDto: CreateCourseInCurriculumDto,
  ): Promise<CourseInCurriculum> {
    const courseInCurriculum = this.coursesInCurriculumRepository.create({
      ...createCourseInCurriculumDto,
      curriculum: { id: createCourseInCurriculumDto.curriculumId },
      course: { id: createCourseInCurriculumDto.courseId },
    });
    return this.coursesInCurriculumRepository.save(courseInCurriculum);
  }

  async findAll(): Promise<CourseInCurriculum[]> {
    return this.coursesInCurriculumRepository.find();
  }

  async findOne(id: number): Promise<CourseInCurriculum | null> {
    return this.coursesInCurriculumRepository.findOne({
      where: { id },
      relations: ['curriculum', 'course'],
    });
  }

  async update(
    id: number,
    updateCourseInCurriculumDto: UpdateCourseInCurriculumDto,
  ): Promise<void> {
    const { curriculumId, courseId, ...updateData } =
      updateCourseInCurriculumDto;

    const updatePayload: Partial<CourseInCurriculum> = { ...updateData };

    if (curriculumId) {
      updatePayload.curriculum = { id: curriculumId } as Curriculum;
    }

    if (courseId) {
      updatePayload.course = { id: courseId } as Course;
    }

    await this.coursesInCurriculumRepository.update(id, updatePayload);
  }

  async remove(id: number): Promise<void> {
    await this.coursesInCurriculumRepository.delete(id);
  }
}

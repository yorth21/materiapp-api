import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursePrerequisite } from '../entities/course-prerequisite.entity';
import { CreateCoursePrerequisiteDto } from '../dtos/course-prerequisites/create-course-prerequisite.dto';
import { UpdateCoursePrerequisiteDto } from '../dtos/course-prerequisites/update-course-prerequisite.dto';

@Injectable()
export class CoursePrerequisitesService {
  constructor(
    @InjectRepository(CoursePrerequisite)
    private coursePrerequisitesRepository: Repository<CoursePrerequisite>,
  ) {}

  async create(
    createCoursePrerequisiteDto: CreateCoursePrerequisiteDto,
  ): Promise<CoursePrerequisite> {
    const coursePrerequisite = this.coursePrerequisitesRepository.create({
      ...createCoursePrerequisiteDto,
      courseInCurriculum: {
        id: createCoursePrerequisiteDto.courseInCurriculumId,
      },
      prerequisiteCic: { id: createCoursePrerequisiteDto.prerequisiteCicId },
    });
    return this.coursePrerequisitesRepository.save(coursePrerequisite);
  }

  async findAll(): Promise<CoursePrerequisite[]> {
    return this.coursePrerequisitesRepository.find();
  }

  async findByCourseInCurriculumId(
    courseInCurriculumId: number,
  ): Promise<CoursePrerequisite[]> {
    return this.coursePrerequisitesRepository.find({
      where: { courseInCurriculumId },
      relations: ['courseInCurriculum', 'prerequisiteCic'],
    });
  }

  async findOne(
    courseInCurriculumId: number,
    prerequisiteCicId: number,
  ): Promise<CoursePrerequisite | null> {
    return this.coursePrerequisitesRepository.findOne({
      where: { courseInCurriculumId, prerequisiteCicId },
      relations: ['courseInCurriculum', 'prerequisiteCic'],
    });
  }

  async update(
    courseInCurriculumId: number,
    prerequisiteCicId: number,
    updateCoursePrerequisiteDto: UpdateCoursePrerequisiteDto,
  ): Promise<void> {
    await this.coursePrerequisitesRepository.update(
      { courseInCurriculumId, prerequisiteCicId },
      updateCoursePrerequisiteDto,
    );
  }

  async remove(
    courseInCurriculumId: number,
    prerequisiteCicId: number,
  ): Promise<void> {
    await this.coursePrerequisitesRepository.delete({
      courseInCurriculumId,
      prerequisiteCicId,
    });
  }
}

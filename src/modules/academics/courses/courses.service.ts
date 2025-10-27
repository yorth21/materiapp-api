import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../../entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  async findOne(id: number): Promise<Course | null> {
    return this.coursesRepository.findOneBy({ id });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<void> {
    await this.coursesRepository.update(id, updateCourseDto);
  }

  async remove(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentsRepository.create(createStudentDto);
    return this.studentsRepository.save(student);
  }
  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find();
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentsRepository.findOneBy({ id });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<void> {
    await this.studentsRepository.update(id, updateStudentDto);
  }

  async remove(id: string): Promise<void> {
    await this.studentsRepository.delete(id);
  }
}

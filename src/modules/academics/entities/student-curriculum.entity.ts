import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Student } from './student.entity';
import { Curriculum } from './curriculum.entity';
import { StudentCourse } from './student-course.entity';

@Entity({
  name: 'student_curricula',
})
export class StudentCurriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @RelationId((sc: StudentCurriculum) => sc.student)
  studentId: string;

  @ManyToOne(() => Student, (student) => student.studentCurricula, {
    nullable: false,
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @RelationId((sc: StudentCurriculum) => sc.curriculum)
  curriculumId: number;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.studentCurricula, {
    nullable: false,
  })
  @JoinColumn({ name: 'curriculum_id' })
  curriculum: Curriculum;

  @OneToMany(() => StudentCourse, (sc) => sc.studentCurriculum)
  studentCourses: StudentCourse[];
}

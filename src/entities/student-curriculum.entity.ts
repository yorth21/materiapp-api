import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Curriculum } from './curriculum.entity';
import { StudentCourse } from './student-course.entity';
import { User } from './user.entity';

@Entity({
  name: 'student_curricula',
})
export class StudentCurriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  semester: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @RelationId((sc: StudentCurriculum) => sc.user)
  userId: string;

  @ManyToOne(() => User, (user) => user.studentCurricula, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

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

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Curriculum } from './curriculum.entity';
import { Course } from './course.entity';
import { CoursePrerequisite } from './course-prerequisite.entity';

@Entity({
  name: 'courses_in_curriculum',
})
export class CourseInCurriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'char', length: 1 })
  calendar: string;

  @Column({ type: 'int' })
  credits: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.coursesInCurriculum, {
    nullable: false,
  })
  @JoinColumn({ name: 'curriculum_id' })
  curriculum: Curriculum;

  @ManyToOne(() => Course, (course) => course.coursesInCurriculum, {
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => CoursePrerequisite, (cp) => cp.courseInCurriculum)
  courses: CoursePrerequisite[];

  @OneToMany(() => CoursePrerequisite, (cp) => cp.prerequisiteCic)
  prerequisites: CoursePrerequisite[];
}

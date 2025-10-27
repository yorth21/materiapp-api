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
import { Course } from './course.entity';
import { StudentCourse } from './student-course.entity';

@Entity({
  name: 'courses_in_curriculum',
})
export class CourseInCurriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'char', length: 2 })
  calendar: string;

  @Column({ type: 'int' })
  credits: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @RelationId((cic: CourseInCurriculum) => cic.curriculum)
  curriculumId: number;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.coursesInCurriculum, {
    nullable: false,
  })
  @JoinColumn({ name: 'curriculum_id' })
  curriculum: Curriculum;

  @RelationId((cic: CourseInCurriculum) => cic.course)
  courseId: number;

  @ManyToOne(() => Course, (course) => course.coursesInCurriculum, {
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @RelationId((cic: CourseInCurriculum) => cic.prerequisite)
  prerequisiteId: number | null;

  @ManyToOne(() => Course, (course) => course.prerequisiteFor, {
    nullable: true,
  })
  @JoinColumn({ name: 'prerequisite_id' })
  prerequisite: Course | null;

  @OneToMany(() => StudentCourse, (sc) => sc.courseInCurriculum)
  studentCourses: StudentCourse[];
}

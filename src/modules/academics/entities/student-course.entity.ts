import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { StudentCurriculum } from './student-curriculum.entity';
import { CourseInCurriculum } from './course-in-curriculum.entity';

@Entity({
  name: 'student_courses',
})
export class StudentCourse {
  @PrimaryColumn({ name: 'student_curriculum_id', type: 'int' })
  studentCurriculumId: number;

  @PrimaryColumn({ name: 'course_in_curriculum_id', type: 'int' })
  courseInCurriculumId: number;

  @ManyToOne(() => StudentCurriculum, (sc) => sc.studentCourses, {
    nullable: false,
  })
  @JoinColumn({ name: 'student_curriculum_id' })
  studentCurriculum: StudentCurriculum;

  @ManyToOne(() => CourseInCurriculum, (cic) => cic.studentCourses, {
    nullable: false,
  })
  @JoinColumn({ name: 'course_in_curriculum_id' })
  courseInCurriculum: CourseInCurriculum;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
}

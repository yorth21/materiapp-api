import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseInCurriculum } from './course-in-curriculum.entity';

@Entity({
  name: 'course_prerequisites',
})
export class CoursePrerequisite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CourseInCurriculum, (cic) => cic.courses, {
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseInCurriculum;

  @ManyToOne(() => CourseInCurriculum, (cic) => cic.prerequisites, {
    nullable: false,
  })
  @JoinColumn({ name: 'prerequisite_id' })
  prerequisite: CourseInCurriculum;
}

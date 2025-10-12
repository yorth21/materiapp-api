import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseInCurriculum } from './course-in-curriculum.entity';

@Entity({
  name: 'course_prerequisites',
})
export class CoursePrerequisite {
  @PrimaryColumn({ name: 'course_in_curriculum_id', type: 'int' })
  courseInCurriculumId: number;

  @ManyToOne(() => CourseInCurriculum, (cic) => cic.courses, {
    nullable: false,
  })
  @JoinColumn({ name: 'course_in_curriculum_id' })
  courseInCurriculum: CourseInCurriculum;

  @PrimaryColumn({ name: 'prerequisite_cic_id', type: 'int' })
  prerequisiteCicId: number;

  @ManyToOne(() => CourseInCurriculum, (cic) => cic.prerequisites, {
    nullable: false,
  })
  @JoinColumn({ name: 'prerequisite_cic_id' })
  prerequisiteCic: CourseInCurriculum;
}

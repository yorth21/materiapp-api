import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentCurriculum } from './student-curriculum.entity';

@Entity({
  name: 'student_curriculum_recommendations',
})
export class StudentCurriculumRecommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_curriculum_id' })
  studentCurriculumId: number;

  @ManyToOne(
    () => StudentCurriculum,
    (studentCurriculum) => studentCurriculum.studentCurriculumRecommendations,
    { nullable: false },
  )
  @JoinColumn({ name: 'student_curriculum_id' })
  studentCurriculum: StudentCurriculum;

  @Column({ type: 'jsonb' })
  payload: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
}

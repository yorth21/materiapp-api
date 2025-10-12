import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from './program.entity';
import { CourseInCurriculum } from './course-in-curriculum.entity';
import { StudentCurriculum } from './student-curriculum.entity';

@Entity({
  name: 'curricula',
})
export class Curriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  version: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Program, (program) => program.curricula, {
    nullable: false,
  })
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @OneToMany(() => CourseInCurriculum, (cic) => cic.curriculum)
  coursesInCurriculum: CourseInCurriculum[];

  @OneToMany(() => StudentCurriculum, (sc) => sc.curriculum)
  studentCurricula: StudentCurriculum[];
}

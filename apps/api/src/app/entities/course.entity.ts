import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CourseInCurriculum } from './course-in-curriculum.entity';

@Entity({
  name: 'courses',
})
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => CourseInCurriculum, (cic) => cic.course)
  coursesInCurriculum: CourseInCurriculum[];

  @OneToMany(() => CourseInCurriculum, (cic) => cic.course)
  prerequisiteFor: CourseInCurriculum[];
}

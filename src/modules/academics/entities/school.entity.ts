import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Campus } from './campus.entity';
import { Program } from './program.entity';

@Entity({
  name: 'schools',
})
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Campus, (campus) => campus.schools, { nullable: false })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;

  @OneToMany(() => Program, (program) => program.school)
  programs: Program[];
}

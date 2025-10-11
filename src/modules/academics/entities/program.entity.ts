import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { School } from './school.entity';

@Entity({
  name: 'programs',
})
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => School, (school) => school.programs, { nullable: false })
  @JoinColumn({ name: 'school_id' })
  school: School;
}

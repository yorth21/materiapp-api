import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

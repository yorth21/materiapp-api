import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './school.entity';

@Entity({
  name: 'campuses',
})
export class Campus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => School, (school) => school.campus)
  schools: School[];
}

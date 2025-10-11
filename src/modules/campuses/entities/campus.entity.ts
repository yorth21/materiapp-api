import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

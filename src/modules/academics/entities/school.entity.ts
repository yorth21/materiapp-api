import { Entity } from 'typeorm';

@Entity({
  name: 'schools',
})
export class School {
  id: number;
  name: string;
}

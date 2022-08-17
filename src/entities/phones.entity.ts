import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brands } from './brands.entity';

@Entity()
export class Phones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 128 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ManyToOne(() => Brands)
  @JoinColumn({ name: 'brand_id' })
  brand: Brands;
}

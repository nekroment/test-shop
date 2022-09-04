import { OS } from 'src/resources';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brands } from './brands.entity';

export interface PhoneImagesType {
  images: string[];
}

@Entity()
export class Phones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 128 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int' })
  memory: number;

  @Column({ type: 'int' })
  ram: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  diagonal: number;

  @Column({ type: 'int' })
  battery: number;

  @Column({ type: 'int' })
  camera: number;

  @Column({ type: 'enum', enum: OS })
  os: OS;

  @Column('json', { default: null, nullable: true })
  image?: PhoneImagesType;

  @ManyToOne(() => Brands)
  @JoinColumn({ name: 'brand_id' })
  brand: Brands;
}

import { Phones } from './phones.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stocks {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Phones)
  @JoinColumn({ name: 'phone_id' })
  phone: Phones;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  percentage: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  start_time: Date;

  @Column({ type: 'datetime' })
  end_time: Date;
}

import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reviews } from './reviews.entity';

import { Users } from './users.entity';

@Entity()
export class ReviewRates {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Reviews)
  @JoinColumn({ name: 'review_id' })
  review: Reviews;

  @Column({ type: 'boolean' })
  rate: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  datetime: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}

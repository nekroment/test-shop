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
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Reviews)
  @JoinColumn({ name: 'review_id' })
  review: Reviews;

  @Column({ type: 'varchar', length: 128, default: '' })
  comment: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  datetime: string;

  @Column({ type: 'datetime', default: null })
  updated: string;

  @Column({ type: 'int', default: 0 })
  comment_rating: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}

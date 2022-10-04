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

  @ManyToOne(() => Reviews, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Reviews;

  @ManyToOne(() => Comments, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  answer: Comments;

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

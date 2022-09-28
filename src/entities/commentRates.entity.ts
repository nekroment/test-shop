import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comments } from './comments.entity';
import { Users } from './users.entity';

@Entity()
export class CommentRates {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Comments)
  @JoinColumn({ name: 'comment_id' })
  comment: Comments;

  @Column({ type: 'boolean' })
  rate: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  datetime: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}

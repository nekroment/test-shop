import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Phones } from './phones.entity';
import { Users } from './users.entity';

@Entity()
@Unique(['user', 'phone'])
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Phones)
  @JoinColumn({ name: 'phone_id' })
  phone: Phones;

  @Column('tinyint', { width: 5, default: 5 })
  rating: number;

  @Column({ type: 'varchar', length: 128, default: '' })
  comment: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  datetime: string;

  @Column({ type: 'datetime', default: null })
  updated: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}

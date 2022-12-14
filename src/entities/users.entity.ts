import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 64 })
  first_name: string;

  @Column('varchar', { length: 64 })
  last_name: string;

  @Column('varchar', { length: 64 })
  email: string;

  @Column('varchar', { length: 64 })
  phone_number: string;

  @Column('boolean', { default: true })
  account_status: boolean;

  @Column('varchar', { length: 255 })
  password_hash: string;

  @Column('varchar', { length: 255, default: null })
  reset_hash: string;

  @Column('mediumint', { width: 9, default: 0 })
  failed_logins: number;

  @Column('bigint', { width: 20, default: 0 })
  last_failed_login: number;

  @Column('bigint', { width: 64, default: 0 })
  failed_tfa_attempts: number;

  @Column('bigint', { width: 64, default: 0 })
  last_failed_tfa_attempt: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_logged_in: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  registration_datetime: string;

  @Column('varchar', { length: 255, default: '' })
  registration_ip: string;

  @Column('boolean', { default: false })
  tfa_enabled: boolean;

  @Column('varchar', { length: 48, default: '' })
  tfa_key: string;

  @Column('boolean', { default: false })
  reauthorization: boolean;
}

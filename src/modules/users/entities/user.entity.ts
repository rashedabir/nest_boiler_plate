import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sys_users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

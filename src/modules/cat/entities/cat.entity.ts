import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cat')
export class CatEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

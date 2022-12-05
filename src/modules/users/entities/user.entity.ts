import { CatEntity } from 'src/modules/cat/entities/cat.entity';
import {
  Column,
  Entity,
  OneToMany,
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

  @OneToMany(() => CatEntity, (cat) => cat.user, { eager: true })
  cats: CatEntity[];

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

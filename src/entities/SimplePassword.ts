import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import User from './User';

@Entity('simple_password')
export default class SimplePassword {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column()
  id!: string;

  @Column({ select: false })
  pw!: string;

  @Column()
  phone!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @RelationId((simplePassword: SimplePassword) => simplePassword.user)
  userId!: string;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import User from './User';

@Entity('account')
export default class Account {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column()
  account!: string;

  @Column()
  password!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @RelationId((account: Account) => account.user)
  userId!: string;
}

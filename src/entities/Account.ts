import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  idx!: number;

  @ApiProperty()
  @Column()
  account!: string;

  @ApiProperty()
  @Column({ select: false })
  password!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ApiProperty()
  @RelationId((account: Account) => account.user)
  userId!: string;
}

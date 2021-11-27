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

@Entity('other')
export default class Other {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  idx!: number;

  @ApiProperty()
  @Column()
  account!: string;

  @ApiProperty()
  @Column()
  bank!: string;

  @ApiProperty()
  @Column()
  money!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ApiProperty()
  @RelationId((other: Other) => other.user)
  userId!: string;
}

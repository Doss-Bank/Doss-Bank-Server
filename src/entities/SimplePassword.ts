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

@Entity('simple_password')
export default class SimplePassword {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  idx!: number;

  @ApiProperty()
  @Column()
  id!: string;

  @ApiProperty()
  @Column({ select: false })
  pw!: string;

  @ApiProperty()
  @Column()
  phone!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ApiProperty()
  @RelationId((simplePassword: SimplePassword) => simplePassword.user)
  userId!: string;
}

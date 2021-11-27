import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Account from './Account';

@Entity('send')
export default class Send {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  idx!: number;

  @ApiProperty()
  @Column()
  toAccount!: string;

  @ApiProperty()
  @Column()
  fromAccount!: string;

  @ApiProperty()
  @Column()
  money!: number;

  @JoinColumn({ name: 'fk_account_idx' })
  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account!: Account;

  @ApiProperty()
  @RelationId((send: Send) => send.account)
  accountIdx!: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

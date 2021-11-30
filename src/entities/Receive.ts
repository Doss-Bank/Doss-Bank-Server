import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Account from './Account';

@Entity('receive')
export default class Receive {
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
  @RelationId((receive: Receive) => receive.account)
  accountIdx!: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

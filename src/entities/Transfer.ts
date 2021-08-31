import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Account from './Account';

@Entity('transfer')
export default class Transfer {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column({ name: 'to_account' })
  toAccount!: string;

  @Column()
  money!: number;

  @JoinColumn({ name: 'fk_account_idx' })
  @ManyToOne((type) => Account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account!: Account;

  @RelationId((transfer: Transfer) => transfer.account)
  accountIdx!: number;
}

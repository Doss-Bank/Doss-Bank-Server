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
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column()
  toAccount!: string;

  @Column()
  fromAccount!: string;

  @Column()
  money!: number;

  @JoinColumn({ name: 'fk_account_idx' })
  @ManyToOne((type) => Account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account!: Account;

  @RelationId((receive: Receive) => receive.account)
  accountIdx!: number;
}

import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Account from './Account';

@Entity('user')
export default class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  pw!: string;

  @Column()
  nick!: string;

  @Column()
  phone!: string;

  @Column()
  birth!: string;

  @OneToMany((type) => Account, (account) => account.user)
  account!: Account[];
}

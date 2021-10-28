import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Account from "./Account";

@Entity('send')
export default class Send {
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

	@RelationId((send: Send) => send.account)
	accountIdx!: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;
}
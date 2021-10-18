import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('other')
export default class Other {
	@PrimaryGeneratedColumn()
	idx!: number;

	@Column()
	account!: string;

	@Column()
	bank!: string;

	@Column()
	money!: string;
}
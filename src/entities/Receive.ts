import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
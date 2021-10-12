import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
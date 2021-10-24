import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import User from "./User";

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

	@JoinColumn({ name: 'fk_user_id' })
	@ManyToOne((type) => User, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	user!: User;

	@ApiProperty()
	@RelationId((other: Other) => other.user)
	userId!: string;
}
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccount {

	@ApiProperty()
	public account!: string;
}
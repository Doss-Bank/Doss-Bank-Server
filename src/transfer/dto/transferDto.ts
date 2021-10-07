import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class TransferDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	receiveAccountId!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	sendAccountPw!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	sendAccountId!: string;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	money!: number;
}
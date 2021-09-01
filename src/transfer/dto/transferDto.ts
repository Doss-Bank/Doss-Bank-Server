import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class TransferDto {

	@IsNotEmpty()
	@IsString()
	receiveAccountId!: string;

	@IsNotEmpty()
	@IsString()
	sendAccountPw!: string;

	@IsNotEmpty()
	@IsString()
	sendAccountId!: string;

	@IsNotEmpty()
	@IsNumber()
	money!: number;
}
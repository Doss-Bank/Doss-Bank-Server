import { IsNotEmpty, IsString } from "class-validator";

export default class TransferDto {

	@IsNotEmpty()
	@IsString()
	toAccount!: string;
}
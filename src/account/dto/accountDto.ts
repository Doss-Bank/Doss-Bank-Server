import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"

export default class AccountDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'pw', required: true })
	pw!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'phone', required: true })
	phone!: string;
}
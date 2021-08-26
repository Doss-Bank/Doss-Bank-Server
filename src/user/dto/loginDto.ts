import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export default class LoginDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'id', required: true })
	id!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: 'pw', required: true })
	pw!: string;
}
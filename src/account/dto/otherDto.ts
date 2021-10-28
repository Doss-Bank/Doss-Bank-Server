import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export default class OtherDto {
	@ApiProperty()
	@IsArray()
	@IsNotEmpty()
	account!: string[];
}
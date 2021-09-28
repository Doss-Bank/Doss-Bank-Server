import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseData {
	@ApiProperty()
	public pwId: string;

	@ApiProperty()
	public token: string;
}
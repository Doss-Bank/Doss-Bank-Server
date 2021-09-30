import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseData {
	@ApiProperty()
	public simpleId: string;

	@ApiProperty()
	public token: string;
}
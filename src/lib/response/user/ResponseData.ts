import { ApiProperty } from "@nestjs/swagger";
import Account from "src/entities/Account";

export class LoginResponseData {
	@ApiProperty()
	public simpleId: string;

	@ApiProperty()
	public token: string;
}

export class ResToken {

	@ApiProperty()
	public token: string;
}

export class GetUserData {
	@ApiProperty()
	public id: string;

	@ApiProperty()
	public nick: string;

	@ApiProperty()
	public phone: string;

	@ApiProperty()
	public birth: string;

	@ApiProperty()
	public account: Account[];
}
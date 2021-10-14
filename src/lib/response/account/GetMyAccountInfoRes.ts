import { ApiProperty } from "@nestjs/swagger";
import Account from "src/entities/Account";
import BaseResponse from "../BaseResponse";

export default class GetMyAccountInfoRes extends BaseResponse<Account[]>{

	@ApiProperty({
		type: () => [Account]
	})
	data: Account[];
}

export class GetAccount extends BaseResponse<Account> {

	@ApiProperty()
	data: Account;
}
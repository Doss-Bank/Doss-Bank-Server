import { ApiProperty } from "@nestjs/swagger";
import Account from "src/entities/Account";
import { IAccount } from "src/interface/IAccount";
import BaseResponse from "../BaseResponse";

export default class GetMyAccountInfoRes extends BaseResponse<IAccount>{

	@ApiProperty()
	data: IAccount;
}

export class GetAccounts extends BaseResponse<Account[]> {

	@ApiProperty({
		type: () => [Account]
	})
	data: Account[];
}

export class GetAccount extends BaseResponse<Account> {

	@ApiProperty()
	data: Account;
}

export class GetOtherAccount extends BaseResponse<string[]> {
	@ApiProperty()
	data: string[];
}
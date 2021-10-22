import { ApiProperty } from "@nestjs/swagger";
import BaseResponse from "../BaseResponse";
import { LoginResponseData, ResToken } from "./ResponseData";

export default class LoginResponse extends BaseResponse<LoginResponseData> {
	@ApiProperty()
	data: LoginResponseData;
}

export class RegisterResponse extends BaseResponse<ResToken> {
	@ApiProperty()
	data: ResToken;
}

export class CheckResponse extends BaseResponse<boolean> {
	@ApiProperty()
	data: boolean;
}
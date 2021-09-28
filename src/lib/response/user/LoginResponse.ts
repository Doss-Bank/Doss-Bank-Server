import { ApiProperty } from "@nestjs/swagger";
import BaseResponse from "../BaseResponse";
import { LoginResponseData } from "./ResponseData";

export default class LoginResponse extends BaseResponse<LoginResponseData> {
	@ApiProperty()
	data: LoginResponseData;
}
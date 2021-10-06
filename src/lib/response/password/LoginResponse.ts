import { ApiProperty } from "@nestjs/swagger";
import BaseResponse from "../BaseResponse";
import { ResToken } from "../user/ResponseData";

export default class LoginRes extends BaseResponse<ResToken> {

	@ApiProperty()
	data: ResToken;
}
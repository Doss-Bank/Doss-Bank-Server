import { ApiProperty } from "@nestjs/swagger";
import BaseResponse from "../BaseResponse";
import { GetUserData } from "./ResponseData";

export default class GetUserRes extends BaseResponse<GetUserData> {

	@ApiProperty()
	data: GetUserData;
}
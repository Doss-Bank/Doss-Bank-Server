import { ApiProperty } from "@nestjs/swagger";
import User from "src/entities/User";
import BaseResponse from "../BaseResponse";

export default class GetUserRes extends BaseResponse<User> {

	@ApiProperty()
	data: User;
}
import { ApiProperty } from '@nestjs/swagger';
import User from 'src/entities/User';
import { BaseResponse } from '../BaseResponse';

export class UserResponseData {
  @ApiProperty()
  user: User;
}

export class UserResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty()
  data: UserResponseData;
}

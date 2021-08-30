import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../BaseResponse';

export class LoginResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty()
  token: string;
}

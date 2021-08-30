import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../BaseResponse';

export class UnauthorizedResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({ default: 401 })
  status: number;
}

import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from '../BaseResponse';
import { IsHavePW } from './ResponseData';

export default class IsHavePwRes extends BaseResponse<IsHavePW> {
  @ApiProperty()
  data: IsHavePW;
}

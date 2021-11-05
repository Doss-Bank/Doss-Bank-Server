import { ApiProperty } from '@nestjs/swagger';
import { AccountRes } from 'src/types/type';
import BaseResponse from '../BaseResponse';

export default class CreateAccountRes extends BaseResponse<AccountRes> {
  @ApiProperty()
  data: AccountRes;
}

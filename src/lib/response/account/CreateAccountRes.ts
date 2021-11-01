import { ApiProperty } from '@nestjs/swagger';
import BaseResponse from '../BaseResponse';
import { CreateAccount } from './ResponseData';

export default class CreateAccountRes extends BaseResponse<CreateAccount> {
  @ApiProperty()
  data: CreateAccount;
}

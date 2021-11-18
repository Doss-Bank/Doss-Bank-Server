import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import BaseResponse from 'src/lib/response/BaseResponse';
import ReceiveDto from './dto/receiveDto';
import TakeDto from './dto/takeDto';
import TransferDto from './dto/transferDto';
import { TransferService } from './transfer.service';

@Controller('transfer')
@ApiTags('transfer')
export class TransferController {
  constructor(private transService: TransferService) {}

  @Post('/send')
  @HttpCode(200)
  @ApiOkResponse({ description: '송금 완료', type: BaseResponse })
  @ApiUnauthorizedResponse({ description: '비밀번호가 틀렸습니다' })
  @ApiForbiddenResponse({ description: '잔액이 부족합니다' })
  async sendMoney(@Body() transferDto: TransferDto) {
    await this.transService.sendMoney(transferDto);

    return new BaseResponse(200, '송금 완료');
  }

  @Post('/get')
  @HttpCode(200)
  @ApiOkResponse({ description: '수신 완료', type: BaseResponse })
  async getMoney(@Body() transferDto: ReceiveDto) {
    await this.transService.getMoney(transferDto);

    return new BaseResponse(200, '수신 완료');
  }

  @Post('/take')
  @HttpCode(200)
  @ApiOkResponse({})
  async takeMoney(@Body() takeDto: TakeDto) {
    await this.transService.takeMoney(takeDto);

    return new BaseResponse(200, '가져오기 성공');
  }
}

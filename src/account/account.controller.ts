import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiExcludeEndpoint, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import Account from 'src/entities/Account';
import User from 'src/entities/User';
import CreateAccountRes from 'src/lib/response/account/CreateAccountRes';
import GetMyAccountInfoRes, { GetAccount } from 'src/lib/response/account/GetMyAccountInfoRes';
import { Token } from 'src/lib/token';
import { AuthGuard } from 'src/middleware/authMiddleware';
import { AccountService } from './account.service';
import AccountDto from './dto/accountDto';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(private accountService: AccountService) { }

  @Post('/')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  @ApiOkResponse({ description: '계좌 생성 성공', type: CreateAccountRes })
  @ApiBasicAuth('authorization')
  async createAccount(@Body() data: AccountDto, @Token() user: User) {
    const account = await this.accountService.createAccount(data, user);

    return new CreateAccountRes(200, "계좌 생성 성공", { account })
  }

  @Get('/admin')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  @ApiExcludeEndpoint()
  async getTotalMoney(@Token() user: User) {
    const money: number = await this.accountService.getTotal(user);

    return {
      status: 200,
      money
    }
  }

  @Get('/admin2')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  @ApiExcludeEndpoint()
  async getUserAccount(@Token() user: User, @Query('userId') userId: string) {
    const account: Account = await this.accountService.getUserMoney(user, userId);

    return {
      status: 200,
      account
    }
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  @ApiOkResponse({ description: '자신의 계좌 조회 성공', type: GetMyAccountInfoRes })
  @ApiBasicAuth('authorization')
  async getMyAccounts(@Token() user: User) {
    const data: Account[] = await this.accountService.getMyAccounts(user);

    return new GetMyAccountInfoRes(200, "자신의 계좌 조회 성공", data);
  }

  @Get('/:phone')
  @HttpCode(200)
  @ApiOkResponse({ description: '계좌 조회 성공', type: GetMyAccountInfoRes })
  @ApiNotFoundResponse({ description: '존재하지 않는 전화번호' })
  async getAccountByPhone(@Param('phone') phone: string) {
    const data: Account[] = await this.accountService.getAccountByPhone(phone);

    return new GetMyAccountInfoRes(200, "계좌 조회 성공", data);
  }

  @Get('/acount/:account')
  @HttpCode(200)
  @ApiOkResponse({ description: '계좌 조회 성공', type: GetAccount })
  @ApiNotFoundResponse({ description: '존재하지 않는 계좌번호' })
  async GetAccountByAccount(@Param('account') account: string) {
    console.log(account);
    const data: Account = await this.accountService.getAccountByAcc(account);

    return new GetAccount(200, "계좌 조회 성공", data);
  }
}

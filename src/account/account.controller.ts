import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import Account from 'src/entities/Account';
import User from 'src/entities/User';
import { Token } from 'src/lib/token';
import { PasswordGuard } from 'src/middleware/authMiddleware';
import { AccountService } from './account.service';
import AccountDto from './dto/accountDto';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(private accountService: AccountService) { }

  @Post('/')
  @HttpCode(200)
  @UseGuards(new PasswordGuard())
  async createAccount(@Body() data: AccountDto, @Token() user: User) {
    const account = await this.accountService.createAccount(data, user);

    return {
      account,
      status: 200,
      message: '계좌 생성 성공',
    };
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(new PasswordGuard())
  async getMyAccounts(@Token() user: User) {
    const data: Account[] = await this.accountService.getMyAccounts(user);

    return {
      data,
      status: 200,
      message: '자신의 계좌 조회 성공',
    }
  }
}

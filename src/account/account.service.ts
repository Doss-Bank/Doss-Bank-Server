import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Account from 'src/entities/Account';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AccountDto from './dto/accountDto';
import User from 'src/entities/User';
import { UserService } from 'src/user/user.service';
import uuid from 'src/lib/uuid';
import { isDefined } from 'class-validator';
import hashPassword from 'src/lib/util/hashPassword';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private userService: UserService,
  ) { }

  async createAccount(data: AccountDto, user: User): Promise<string> {
    const isUser: User = await this.userService.getMyInfo(user.phone);

    if (isUser.phone !== data.phone) {
      throw new BadRequestException('계정정보의 전화번호와 다릅니다');
    }

    let acc: string;
    while (true) {
      acc = uuid();

      const isExist: Account | undefined = await this.accountRepo.findOne({
        where: {
          account: acc,
        },
      });

      if (isDefined(isExist)) {
        continue;
      }

      break;
    }

    const account: Account = this.accountRepo.create({
      account: uuid(),
      password: hashPassword(data.accountPW),
      name: data.name,
    });
    account.user = isUser;

    await this.accountRepo.save(account);

    return account.account;
  }

  async getMyAccounts(user: User): Promise<Account[]> {
    const userData: User = await this.userService.getMyInfo(user.phone);

    const accounts: Account[] = await this.accountRepo.find({
      where: {
        user: userData,
      },
      relations: ['user'],
    });

    return accounts;
  }

  async getAccountByPhone(phone: string): Promise<Account[]> {
    const user: User = await this.userService.getMyInfo(phone);

    const accounts: Account[] = await this.accountRepo.find({
      where: {
        user: user
      },
      relations: ['user'],
    });

    return accounts;
  }

  async getAccountByAccount(accountNum: string): Promise<Account> {
    const data: Account = await this.accountRepo.findOne({
      where: {
        account: accountNum,
      }
    });

    if (data === undefined || data === null) {
      throw new NotFoundException('존재하지 않는 계좌입니다');
    }

    return data;
  }
}

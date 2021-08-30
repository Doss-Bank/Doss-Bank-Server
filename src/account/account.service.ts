import { BadRequestException, Injectable } from '@nestjs/common';
import Account from 'src/entities/Account';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AccountDto from './dto/accountDto';
import User from 'src/entities/User';
import { UserService } from 'src/user/user.service';
import uuid from 'src/lib/uuid';
import { validateData } from 'src/lib/util/validateData';
import { isDefined } from 'class-validator';

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

    let acc;
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
      password: await this.userService.hashPW(data.simplePW),
      name: data.name
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
      relations: ['user']
    });

    return accounts;
  }
}

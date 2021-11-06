import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Account from 'src/entities/Account';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AccountDto from './dto/accountDto';
import User from 'src/entities/User';
import { UserService } from 'src/user/user.service';
import { isDefined } from 'class-validator';
import hashPassword from 'src/lib/util/hashPassword';
import generateAccount from 'src/lib/uuid';
import Other from 'src/entities/Other';
import { IAccount } from 'src/interface/IAccount';
import axios from 'axios';
import { Address, BringAccountInfo, GetAccount } from 'src/enum/account';
import OtherDto from './dto/otherDto';
import checkBankUtil from 'src/lib/util/checkBankUtil';
import { AccountRes } from 'src/types/type';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private userService: UserService,
    @InjectRepository(Other)
    private otherRepo: Repository<Other>,
  ) { }

  async createAccount(data: AccountDto, user: User): Promise<AccountRes> {
    const isUser: User = await this.userService.getMyInfo(user.phone);

    if (data.birth !== isUser.birth) {
      throw new BadRequestException('정보가 올바르지 않습니다');
    }

    const limit: Account[] = await this.accountRepo.find({
      where: {
        user: isUser,
      },
    });

    if (limit.length > 2)
      throw new BadRequestException('계좌는 2개까지만 생성할 수 있습니다');

    let acc: string;
    while (true) {
      acc = generateAccount();

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

    // let accountType: string;
    // switch (data.type) {
    //   case 1:
    //     accountType = '자유 입출금';
    // break;
    // }

    const account: Account = this.accountRepo.create({
      account: acc,
      password: hashPassword(data.accountPW),
      name: data.name,
      money: 10000,
      accountType: '자유 입출금',
      bank: 'Toss',
    });
    account.user = isUser;

    await this.accountRepo.save(account);

    const res = {
      account: account.account,
      limit: 10000000,
    };

    return res;
  }

  async getMyAccounts(user: User): Promise<IAccount> {
    const userData: User = await this.userService.getMyInfo(user.phone);

    const accounts: Account[] = await this.accountRepo.find({
      where: {
        user: userData,
      },
      relations: ['user', 'send', 'receive'],
    });

    const others: Other[] = await this.otherRepo.find({
      where: {
        user: userData,
      },
    });

    for (const other of others) {
      const bank: BringAccountInfo = checkBankUtil(
        other.account.slice(0, 3),
        1,
      );

      await this.updateOtherAccount(bank, other.account);
    }

    return {
      accounts,
      others,
    };
  }

  async updateOtherAccount(bank: BringAccountInfo, account: string) {
    const other: Other = await this.otherRepo.findOne({
      where: {
        account: account,
      },
    });
    const res = await axios.get(bank + `/${account}`);

    other.money = res.data.data.money;

    await this.otherRepo.save(other);
  }

  async getAccountByPhone(phone: string): Promise<Account[]> {
    const user: User = await this.userService.getMyInfo(phone);

    const accounts: Account[] = await this.accountRepo.find({
      where: {
        user: user,
      },
      relations: ['user'],
    });

    return accounts;
  }

  async getAccountByAccount(accountNum: string): Promise<Account> {
    const data: Account = await this.accountRepo.findOne({
      select: ['idx', 'account', 'money', 'password'],
      where: {
        account: accountNum,
      },
    });

    if (data === undefined || data === null) {
      throw new NotFoundException('존재하지 않는 계좌입니다');
    }

    return data;
  }

  async getTotal(user: User): Promise<number> {
    const isAdmin: User = await this.userService.getMyInfo(user.phone);

    if (isAdmin.id !== 'admin') {
      throw new UnauthorizedException('권한이 없습니다');
    }

    return this.accountRepo
      .createQueryBuilder()
      .select('SUM(money)', 'money')
      .getRawOne();
  }

  async getUserMoney(user: User, userId: string): Promise<Account> {
    const isUser: User | undefined = await this.userService.getMyInfo(
      user.phone,
    );

    if (isUser === undefined) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (isUser.id !== 'admin') {
      throw new UnauthorizedException('권한이 없습니다');
    }

    const account: Account = await this.accountRepo
      .createQueryBuilder('account')
      .select('SUM(account.money)', 'money')
      .addSelect('COUNT(*)', 'count')
      .where('account.fk_user_id = :userId', { userId })
      .getRawOne();

    return account;
  }

  async getAccountByAcc(account: string): Promise<Account> {
    const isAccount: Account | undefined = await this.accountRepo.findOne({
      where: {
        account: account,
      },
      relations: ['user'],
    });

    if (!isDefined(isAccount)) {
      throw new NotFoundException('존재하지 않는 계좌번호');
    }

    return isAccount;
  }

  async getOtherAccount(birth: string, name: string): Promise<any> {
    const user: User = await this.userService.getMyInfoByNameAndBirth(
      name,
      birth,
    );

    const res = await axios.get(GetAccount.KaKao + `/${user.phone}`);

    return res.data.data;
  }

  async addOtherAccount(otherDto: OtherDto, user: User): Promise<void> {
    const { account } = otherDto;
    const userData: User = await this.userService.getMyInfo(user.phone);

    for (let i = 0; i < account.length; i++) {
      const checkBank = checkBankUtil(account[i], 1);

      const res = await axios.get(`${checkBank}/${account[i]}`);

      const createOther: Other = this.otherRepo.create({
        user: userData,
        account: res.data.data.accountId,
        money: res.data.data.money,
        bank: checkBankUtil(account[i], 2),
      });
      await this.otherRepo.save(createOther);
    }
  }

  async getOtherAccountByAccount(bank: number, account: string): Promise<any> {
    if (bank === 1) {
      try {
        const res = await axios.get(
          `${Address.KAKAO}/account/find/id/${account}`,
        );
        return res.data;
      } catch (e) {
        throw new BadRequestException('존재하지 않은 카카오뱅크 계좌');
      }
    } else if (bank === 2) {
      const res = await this.accountRepo.findOne({
        where: {
          account: account,
        },
      });

      return res;
    } else {
      throw new BadRequestException('존재하지 않는 은행');
    }
  }
}

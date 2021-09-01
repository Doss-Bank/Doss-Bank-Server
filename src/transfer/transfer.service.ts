import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { async } from 'rxjs';
import AccountRepository from 'src/account/account.repository';
import { AccountService } from 'src/account/account.service';
import Account from 'src/entities/Account';
import Transfer from 'src/entities/Transfer';
import { TransferTo } from 'src/enum/account';
import checkBankUtil from 'src/lib/util/checkBankUtil';
import hashPassword from 'src/lib/util/hashPassword';
import { Connection, Repository } from 'typeorm';
import TransferDto from './dto/transferDto';
import TransferRepository from './transfer.repository';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private tfRepo: Repository<Transfer>,
    private transferRepo: TransferRepository,
    private accountRepo: AccountRepository,
    @InjectRepository(Account)
    private atRepo: Repository<Account>,
    private connection: Connection,
    private accountService: AccountService,
  ) { }

  public sendMoney = async (data: TransferDto) => {
    if (data.receiveAccountId === data.sendAccountId) {
      throw new ForbiddenException('본인 계좌에는 송금할 수 없습니다.');
    }

    let account: Account = await this.accountService.getAccountByAccount(data.receiveAccountId);
    const hashPW: string = hashPassword(data.sendAccountPw);

    if (account.password !== hashPW) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }

    const afterMoney: number = account.money - data.money;

    if (afterMoney < 0) {
      throw new ForbiddenException('잔액 부족');
    }

    account.money = afterMoney;

    const toBank: TransferTo = checkBankUtil(data.receiveAccountId);

    await this.connection.transaction('SERIALIZABLE', async manager => {
      account = await this.accountRepo.saveAccount(manager, account);

      await axios.post(toBank, {
        sendAccountId: data.sendAccountId,
        sendAccountPw: data.sendAccountPw,
        receiveAccountId: data.receiveAccountId,
        money: data.money,
      }, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    });

    const createTransfer: Transfer = this.tfRepo.create({
      toAccount: data.receiveAccountId,
      money: data.money
    });
    createTransfer.account = account;
    await this.tfRepo.save(createTransfer);
  }

  public getMoney = async (data: TransferDto) => {
    let account: Account = await this.accountService.getAccountByAccount(data.receiveAccountId);

    const afterMoney: number = account.money + data.money;

    account.money = afterMoney;

    // await this.connection.transaction('SERIALIZABLE', async manager => {
    //   account = await this.accountRepo.saveAccount(manager, account);
    // });

    account = await this.atRepo.save(account);

    const createTransfer: Transfer = this.tfRepo.create({
      toAccount: data.receiveAccountId,
      money: data.money,
    });
    createTransfer.account = account;
    await this.tfRepo.save(createTransfer);
  }
}

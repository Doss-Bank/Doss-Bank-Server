import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import AccountRepository from 'src/account/account.repository';
import { AccountService } from 'src/account/account.service';
import Account from 'src/entities/Account';
import Receive from 'src/entities/Receive';
import Send from 'src/entities/Send';
import { TransferTo } from 'src/enum/account';
import checkBankUtil from 'src/lib/util/checkBankUtil';
import hashPassword from 'src/lib/util/hashPassword';
import { Connection, Repository } from 'typeorm';
import ReceiveDto from './dto/receiveDto';
import TransferDto from './dto/transferDto';
import ReceiveRepository from './repos/receive.repository';
import SendRepository from './repos/send.repository';

@Injectable()
export class TransferService {
  constructor(
    private accountRepo: AccountRepository,
    @InjectRepository(Account)
    private atRepo: Repository<Account>,
    private connection: Connection,
    private accountService: AccountService,
    private sendRepo: SendRepository,
    private receiveRepo: ReceiveRepository,
  ) { }

  public sendMoney = async (data: TransferDto) => {
    if (data.receiveAccountId === data.sendAccountId) {
      throw new ForbiddenException('본인 계좌에는 송금할 수 없습니다.');
    }

    let account: Account = await this.accountService.getAccountByAccount(data.sendAccountId);
    const hashPW: string = hashPassword(data.sendAccountPw);

    if (account.password !== hashPW) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }

    const afterMoney: number = account.money - data.money - 500;

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

    const createSend: Send = this.sendRepo.create({
      toAccount: data.receiveAccountId,
      fromAccount: data.sendAccountId,
      money: data.money
    });
    createSend.account = account;
    await this.sendRepo.save(createSend);
  }

  public getMoney = async (data: ReceiveDto) => {
    let account: Account = await this.accountService.getAccountByAccount(data.receiveAccountId);

    const afterMoney: number = account.money + data.money;

    account.money = afterMoney;

    account = await this.atRepo.save(account);

    const createReceive: Receive = this.receiveRepo.create({
      toAccount: data.receiveAccountId,
      fromAccount: data.sendAccountId,
      money: data.money
    });
    createReceive.account = account;
    await this.receiveRepo.save(createReceive);
  }
}

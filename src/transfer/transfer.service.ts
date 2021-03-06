import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import AccountRepository from 'src/account/account.repository';
import { AccountService } from 'src/account/account.service';
import OtherRepository from 'src/account/other.repository';
import Account from 'src/entities/Account';
import Other from 'src/entities/Other';
import Receive from 'src/entities/Receive';
import Send from 'src/entities/Send';
import { TransferTo } from 'src/enum/account';
import checkBankUtil, { checkBankByNum } from 'src/lib/util/checkBankUtil';
import hashPassword from 'src/lib/util/hashPassword';
import { Connection, Repository } from 'typeorm';
import ReceiveDto from './dto/receiveDto';
import TakeDto from './dto/takeDto';
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
    @InjectRepository(Other)
    private otherRepo: Repository<Other>,
    private otherRepository: OtherRepository,
  ) { }

  public sendMoney = async (data: TransferDto) => {
    if (data.receiveAccountId === data.sendAccountId) {
      throw new ForbiddenException('본인 계좌에는 송금할 수 없습니다.');
    }

    const toBank: TransferTo = checkBankUtil(data.receiveAccountId, 0);

    const checkBank = checkBankByNum(data.bank);

    if (toBank !== checkBank) {
      throw new BadRequestException('잘못된 계좌번호 혹은 은행입니다');
    }

    let account: Account = await this.accountService.getAccountByAccount(
      data.sendAccountId,
    );
    const hashPW: string = hashPassword(data.sendAccountPw);

    if (account.password !== hashPW) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }

    const sendLog = await this.sendRepo.getLog(account);
    if (sendLog[0].sum > 10000000) {
      throw new BadRequestException('이체 한도 초과');
    }

    const afterMoney: number = account.money - data.money - 500;

    if (afterMoney < 0) {
      throw new ForbiddenException('잔액 부족');
    }

    account.money = afterMoney;

    await this.connection.transaction('SERIALIZABLE', async (manager) => {
      account = await this.accountRepo.saveAccount(manager, account);

      await axios.post(
        toBank,
        {
          sendAccountId: data.sendAccountId,
          sendAccountPw: data.sendAccountPw,
          receiveAccountId: data.receiveAccountId,
          money: data.money,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    });

    const createSend: Send = this.sendRepo.create({
      toAccount: data.receiveAccountId,
      fromAccount: data.sendAccountId,
      money: data.money,
    });
    createSend.account = account;
    await this.sendRepo.save(createSend);
  };

  public getMoney = async (data: ReceiveDto) => {
    let account: Account = await this.accountService.getAccountByAccount(
      data.receiveAccountId,
    );

    const afterMoney: number = account.money + data.money;

    account.money = afterMoney;

    account = await this.atRepo.save(account);

    const createReceive: Receive = this.receiveRepo.create({
      toAccount: data.receiveAccountId,
      fromAccount: data.sendAccountId,
      money: data.money,
    });
    createReceive.account = account;
    await this.receiveRepo.save(createReceive);
  };

  public takeMoney = async (takeDto: TakeDto) => {
    const receiveAccount: Account =
      await this.accountService.getAccountByAccount(takeDto.receiveAccountId);

    let sendAccount;

    if (takeDto.sendAccountId.slice(0, 3) === '002') {
      sendAccount = await this.accountService.getAccountByAccount(
        takeDto.sendAccountId,
      );

      if (hashPassword(takeDto.sendAccountPw) !== sendAccount.password) {
        throw new BadRequestException('비밀번호가 틀렸습니다');
      }
    } else {
      sendAccount = await this.otherRepo.findOne({
        account: takeDto.sendAccountId,
      });
    }

    if (sendAccount === undefined) {
      throw new BadRequestException('등록되지 않은 계좌입니다');
    }

    const afterMoney: number = sendAccount.money - takeDto.money;

    if (afterMoney < 0) {
      throw new ForbiddenException('잔액 부족');
    }

    sendAccount.money = afterMoney;

    const toBank: TransferTo = checkBankUtil(takeDto.receiveAccountId, 3);

    await this.connection.transaction('SERIALIZABLE', async (manager) => {
      if (takeDto.receiveAccountId.slice(0, 3) === '002') {
        receiveAccount.money += takeDto.money;
        await this.accountRepo.saveAccount(manager, receiveAccount); //a

        sendAccount = await this.accountRepo.saveAccount(manager, sendAccount);
      } else {
        const res = await axios.post(
          toBank,
          {
            sendAccountId: takeDto.sendAccountId,
            receiveAccountId: takeDto.receiveAccountId,
            money: takeDto.money,
            sendAccountPw: takeDto.sendAccountPw,
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          },
        );

        if (res.data.status === 200) {
          sendAccount = await this.otherRepository.saveAccount(
            manager,
            sendAccount,
          );
        }
      }
    });
  };
}

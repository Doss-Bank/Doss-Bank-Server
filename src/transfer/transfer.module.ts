import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Transfer from 'src/entities/Transfer';
import { AccountService } from 'src/account/account.service';
import Account from 'src/entities/Account';
import User from 'src/entities/User';
import { UserService } from 'src/user/user.service';
import AccountRepository from 'src/account/account.repository';
import TransferRepository from './repos/transfer.repository';
import { PasswordService } from 'src/password/password.service';
import SimplePassword from 'src/entities/SimplePassword';
import { SseModule } from 'src/sse/sse.module';
import SendRepository from './repos/send.repository';
import ReceiveRepository from './repos/receive.repository';
import { SendSubscriber } from './subscriber/send.subscriber';
import { ReceiveSubscriber } from './subscriber/receive.subsriber';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, Account, User, SimplePassword, SendRepository, ReceiveRepository]), SseModule],
  providers: [TransferService, AccountService, UserService, AccountRepository, TransferRepository, PasswordService, SendSubscriber, ReceiveSubscriber],
  controllers: [TransferController],
})
export class TransferModule { }

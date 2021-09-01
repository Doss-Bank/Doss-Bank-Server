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
import TransferRepository from './transfer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, Account, User])],
  providers: [TransferService, AccountService, UserService, AccountRepository, TransferRepository],
  controllers: [TransferController],
})
export class TransferModule { }

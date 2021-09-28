import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/entities/Account';
import { UserService } from 'src/user/user.service';
import User from 'src/entities/User';
import { PasswordService } from 'src/password/password.service';
import SimplePassword from 'src/entities/SimplePassword';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, SimplePassword])],
  providers: [AccountService, UserService, PasswordService],
  controllers: [AccountController],
})
export class AccountModule { }

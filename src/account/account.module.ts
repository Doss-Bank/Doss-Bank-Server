import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/entities/Account';
import { UserService } from 'src/user/user.service';
import User from 'src/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountService, UserService],
  controllers: [AccountController],
})
export class AccountModule {}

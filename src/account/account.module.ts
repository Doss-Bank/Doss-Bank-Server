import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/entities/Account';
import { UserService } from 'src/user/user.service';
import User from 'src/entities/User';
import { PasswordService } from 'src/password/password.service';
import SimplePassword from 'src/entities/SimplePassword';
import { SseService } from 'src/sse/sse.service';
import Other from 'src/entities/Other';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, SimplePassword, Other])],
  providers: [AccountService, UserService, PasswordService, SseService],
  controllers: [AccountController],
})
export class AccountModule {}

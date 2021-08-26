import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import SimplePassword from 'src/entities/SimplePassword';
import User from 'src/entities/User';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([SimplePassword, User])],
  providers: [PasswordService, UserService],
  controllers: [PasswordController]
})
export class PasswordModule { }

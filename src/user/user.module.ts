import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/User';
import SimplePassword from 'src/entities/SimplePassword';
import { PasswordService } from 'src/password/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SimplePassword])],
  providers: [UserService, PasswordService],
  controllers: [UserController],
})
export class UserModule {}

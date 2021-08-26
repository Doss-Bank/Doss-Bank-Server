import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { PasswordModule } from './password/password.module';
import { TransferModule } from './transfer/transfer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormConfig';
import { SendModule } from './send/send.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), UserModule, AccountModule, PasswordModule, TransferModule, SendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

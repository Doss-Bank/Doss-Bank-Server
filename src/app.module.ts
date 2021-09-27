import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { PasswordModule } from './password/password.module';
import { TransferModule } from './transfer/transfer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormConfig';
import { APP_FILTER } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import CatchException from './lib/errLib';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    PasswordModule,
    AccountModule,
    TransferModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CatchException,
    },
  ],
})
export class AppModule { }

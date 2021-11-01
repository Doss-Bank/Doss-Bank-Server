import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { PasswordModule } from './password/password.module';
import { TransferModule } from './transfer/transfer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormConfig';
import { APP_FILTER } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { SseModule } from './sse/sse.module';
import CatchException from './lib/errLib';
import { ErrorModule } from './error/error.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    SseModule,
    UserModule,
    PasswordModule,
    AccountModule,
    TransferModule,
    ProductModule,
    ErrorModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchException,
    },
  ],
})
export class AppModule {}

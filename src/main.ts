import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Doss-Bank')
    .setVersion('1.0')
    .setDescription(
      '로그인 로직 => 회원가입(토큰 발행) -> 회원가입때 받은 토큰을 이용해서 간편비밀번호 생성 -> 최초 1회 로그인시 간편 로그인을 위한 고유번호 리턴 -> 이후 해당 고유번호로 간편로그인 가능',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'authorization',
        in: 'header',
      },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use('/public', express.static(join(__dirname, '../public')));
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();

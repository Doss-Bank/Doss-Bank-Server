import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class TransferDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  receiveAccountId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sendAccountPw!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sendAccountId!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  money!: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  type?: number; // 1 -> 가져오기, null -> 송금
}

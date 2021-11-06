import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  bank!: number;

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
}

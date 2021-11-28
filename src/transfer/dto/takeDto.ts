import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class TakeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  receiveAccountId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sendAccountId!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  money!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sendAccountPw!: string;
}

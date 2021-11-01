import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class ReceiveDto {
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
}

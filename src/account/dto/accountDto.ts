import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class AccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accountPW!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  birth!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '1 = 자유 입출금, 2 = ???' })
  type!: number;
}

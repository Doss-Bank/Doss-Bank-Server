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
}

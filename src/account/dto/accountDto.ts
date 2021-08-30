import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class AccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  simplePW!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string;
}

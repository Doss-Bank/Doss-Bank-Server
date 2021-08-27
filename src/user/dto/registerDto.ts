import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'id', required: true })
  id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'pw', required: true })
  pw!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'nick', required: true })
  nick!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'phone', required: true })
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'birth', required: true })
  birth!: string;
}

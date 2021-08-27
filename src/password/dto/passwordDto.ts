import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class PasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'pw', required: true })
  pw!: string;
}

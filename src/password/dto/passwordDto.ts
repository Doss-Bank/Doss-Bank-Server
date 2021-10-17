import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class PasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'pw', required: true })
  @Length(6)
  pw!: string;
}

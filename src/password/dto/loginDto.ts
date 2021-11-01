import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class PasswordLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'id(일반 로그인 시 리턴한 uuid)',
    required: true,
  })
  id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'pw', required: true })
  pw!: string;
}

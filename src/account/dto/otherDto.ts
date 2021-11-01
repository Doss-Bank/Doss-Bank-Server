import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export default class OtherDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  account!: string[];
}

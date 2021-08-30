import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponse {
  @ApiProperty({
    default: 200,
  })
  status: number;

  @ApiProperty()
  message: string;
}

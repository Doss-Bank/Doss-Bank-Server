import { ApiProperty } from '@nestjs/swagger';

export class IsHavePW {
  @ApiProperty()
  public isHave: boolean;
}

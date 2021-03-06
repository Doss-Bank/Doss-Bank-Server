import {
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as tokenLib from 'src/lib/token';
import User from 'src/entities/User';

export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization'];

    if (token === undefined) {
      throw new NotFoundException('토큰이 존재하지 않습니다');
    }

    request.user = this.validateToken(token);
    return true;
  }

  public validateToken(token: string): User {
    try {
      const verify: User = tokenLib.verifyToken(token) as User;
      return verify;
    } catch (error) {
      console.log(error.message);
      switch (error.message) {
        case 'invalid signature':
        case 'invalid token':
        case 'NO_USER':
        case 'jwt malformed':
          throw new UnauthorizedException('유효하지 않은 토큰');

        case 'jwt expired':
          throw new UnauthorizedException('만료된 토큰');

        default:
          throw new InternalServerErrorException('이게 서버 오류라고?');
      }
    }
  }
}

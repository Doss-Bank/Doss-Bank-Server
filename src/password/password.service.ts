import { Injectable, UnauthorizedException } from '@nestjs/common';
import SimplePassword from 'src/entities/SimplePassword';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User';
import PasswordDto from './dto/passwordDto';
import { UserService } from 'src/user/user.service';
import { generateAccessToken } from 'src/lib/token';
import hashPassword from 'src/lib/util/hashPassword';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(SimplePassword)
    private pwRepository: Repository<SimplePassword>,
    private userService: UserService,
  ) { }

  async makePassword(user: User, passwordDto: PasswordDto) {
    const userData: User = await this.userService.getMyInfo(user.id);
    const hash: string = hashPassword(passwordDto.pw);

    const pw: SimplePassword | undefined = await this.pwRepository.findOne({
      where: {
        phone: userData.phone,
      },
    });

    if (pw !== undefined) {
      throw new UnauthorizedException('간편인증번호는 1회만 생성이 가능합니다');
    }

    const data: SimplePassword = await this.pwRepository.create({
      phone: userData.phone,
      pw: hash,
    });
    data.user = userData;
    await this.pwRepository.save(data);
  }

  async isHavePW(user: User): Promise<boolean> {
    const userData: User = await this.userService.getMyInfo(user.id);

    const pw: SimplePassword | undefined = await this.pwRepository.findOne({
      where: {
        phone: userData.phone,
      },
    });

    if (pw !== undefined) {
      return false;
    }

    return true;
  }

  async login(user: User, data: PasswordDto): Promise<string> {
    const userData: User = await this.userService.getMyInfo(user.id);
    const hash: string = hashPassword(data.pw);

    const pw: SimplePassword | undefined = await this.pwRepository.findOne({
      where: {
        phone: userData.phone,
        pw: hash,
      },
    });

    if (pw === undefined) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }

    return generateAccessToken(userData.phone);
  }
}

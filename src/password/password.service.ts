import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import SimplePassword from 'src/entities/SimplePassword';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User';
import PasswordDto from './dto/passwordDto';
import { UserService } from 'src/user/user.service';
import { generateAccessToken } from 'src/lib/token';
import hashPassword from 'src/lib/util/hashPassword';
import { v4 as uuid } from 'uuid';
import PasswordLoginDto from './dto/loginDto';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(SimplePassword)
    private pwRepository: Repository<SimplePassword>,
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

    const id: string = uuid();

    const data: SimplePassword = this.pwRepository.create({
      id: id,
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

  async login(data: PasswordLoginDto): Promise<string> {
    const hash: string = hashPassword(data.pw);

    const pw: SimplePassword | undefined = await this.pwRepository.findOne({
      where: {
        id: data.id,
        pw: hash,
      },
    });

    if (pw === undefined) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다');
    }

    const user: User = await this.userService.getById(pw.userId);

    return generateAccessToken(user.phone);
  }

  async getId(phone: string): Promise<string> {
    const data: SimplePassword | undefined = await this.pwRepository.findOne({
      where: {
        phone: phone
      }
    });

    if (data === undefined) {
      throw new NotFoundException('정보를 찾을 수 없습니다');
    }

    return data.id;
  }
}

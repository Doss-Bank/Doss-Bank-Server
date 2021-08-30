import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User';
import { Repository } from 'typeorm';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import { createHash } from 'crypto';
import { generateAuthToken } from 'src/lib/token';
import { validateData } from 'src/lib/util/validateData';
import { isDefined } from 'class-validator';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) { }

	async register(registerDto: RegisterDto): Promise<void> {
		const user: User | undefined = await this.userRepository.findOne({
			where: {
				id: registerDto.id,
			},
		});

		if (isDefined(user)) {
			throw new UnauthorizedException('이미 존재하는 아이디입니다');
		}

		const hash: string = await this.hashPW(registerDto.pw);

		this.userRepository.save({
			id: registerDto.id,
			pw: hash,
			nick: registerDto.nick,
			birth: registerDto.birth,
			phone: registerDto.phone,
		});
	}

	async login(loginDto: LoginDto): Promise<string> {
		const hash: string = await this.hashPW(loginDto.pw);

		const user: User | undefined = await this.userRepository.findOne({
			id: loginDto.id,
			pw: hash,
		});

		validateData(user);

		return generateAuthToken(user.id);
	}

	async hashPW(pw: string): Promise<string> {
		return createHash('sha512').update(pw).digest('base64');
	}

	async getMyInfo(phone: string): Promise<User> {
		return this.userRepository.findOne({
			where: {
				phone,
			},
			relations: ['account'],
		});
	}
}

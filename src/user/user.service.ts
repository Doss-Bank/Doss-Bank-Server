import {
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User';
import { Repository } from 'typeorm';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import { generateAccessToken } from 'src/lib/token';
import { validateData } from 'src/lib/util/validateData';
import { isDefined } from 'class-validator';
import hashPassword from 'src/lib/util/hashPassword';
import { ILogin } from 'src/interface/ILogin';
import SimplePassword from 'src/entities/SimplePassword';
import { PasswordService } from 'src/password/password.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@Inject(forwardRef(() => PasswordService))
		private pwService: PasswordService,
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

		const hash: string = hashPassword(registerDto.pw);

		this.userRepository.save({
			id: registerDto.id,
			pw: hash,
			nick: registerDto.nick,
			birth: registerDto.birth,
			phone: registerDto.phone,
		});
	}

	async login(loginDto: LoginDto): Promise<ILogin> {
		const hash: string = hashPassword(loginDto.pw);

		const user: User | undefined = await this.userRepository.findOne({
			id: loginDto.id,
			pw: hash,
		});

		validateData(user);

		const token: string = generateAccessToken(user.phone);
		const simpleId: string = await this.pwService.getId(user.phone);

		return {
			simpleId,
			token,
		}
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

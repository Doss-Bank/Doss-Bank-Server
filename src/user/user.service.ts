import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User';
import { Repository } from 'typeorm';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import { generateAccessToken, generateRegisterToken } from 'src/lib/token';
import { validateData } from 'src/lib/util/validateData';
import { isDefined } from 'class-validator';
import hashPassword from 'src/lib/util/hashPassword';
import { ILogin } from 'src/interface/ILogin';
import { PasswordService } from 'src/password/password.service';
import { ResToken } from 'src/lib/response/user/ResponseData';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@Inject(forwardRef(() => PasswordService))
		private pwService: PasswordService,
	) { }

	async register(registerDto: RegisterDto): Promise<ResToken> {
		const user: User | undefined = await this.userRepository.findOne({
			where: {
				id: registerDto.id,
			},
		});

		if (isDefined(user)) {
			throw new UnauthorizedException('이미 존재하는 아이디입니다');
		}

		const hash: string = hashPassword(registerDto.pw);

		await this.userRepository.save({
			id: registerDto.id,
			pw: hash,
			nick: registerDto.nick,
			birth: registerDto.birth,
			phone: registerDto.phone,
		});

		const token: string = generateRegisterToken(registerDto.id);

		return {
			token,
		};
	}

	async login(loginDto: LoginDto): Promise<ILogin> {
		const hash: string = hashPassword(loginDto.pw);

		const user: User | undefined = await this.userRepository.findOne({
			id: loginDto.id,
			pw: hash,
		});

		validateData(user);

		const token: string = generateAccessToken(user.phone);
		const simpleId: string | undefined = await this.pwService.getId(user.phone);

		return {
			simpleId,
			token,
		}
	}

	async getMyInfo(phone: string): Promise<User> {
		return this.userRepository.findOne({
			where: {
				phone: phone
			},
			relations: ['account'],
		});
	}

	async getById(id: string): Promise<User> {
		const data: User | undefined = await this.userRepository.findOne({
			where: {
				id: id
			}
		});

		if (data === undefined) {
			throw new NotFoundException("존재하지 않는 유저");
		}

		return data;
	}
}

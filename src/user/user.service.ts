import {
	BadRequestException,
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
		const id: User | undefined = await this.userRepository.findOne({
			where: {
				id: registerDto.id,
			},
		});

		if (isDefined(id)) {
			throw new UnauthorizedException('이미 존재하는 아이디입니다');
		}

		const IdRegex = /^[a-z0-9]{3,12}$/;
		if (!IdRegex.test(registerDto.id)) {
			throw new BadRequestException('올바르지 않은 형식의 아이디 입니다');
		}

		const PasswordRegex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
		if (!PasswordRegex.test(registerDto.pw)) {
			throw new BadRequestException('올바르지 않은 형식의 비밀번호 입니다');
		}

		const BirthRegex = /^[0-9]{7}/;
		if (!BirthRegex.test(registerDto.birth)) {
			throw new BadRequestException('올바르지 않은 형식의 생일입니다');
		}

		const phone: User = await this.userRepository.findOne({
			phone: registerDto.phone,
		});

		if (isDefined(phone)) {
			throw new UnauthorizedException('이미 존재하는 전화번호입니다');
		}

		await this.userRepository.save({
			id: registerDto.id,
			pw: hashPassword(registerDto.pw),
			nick: registerDto.nick,
			name: registerDto.name,
			birth: registerDto.birth,
			phone: registerDto.phone,
		});

		const token: string = generateRegisterToken(registerDto.id);

		return {
			token,
		};
	}

	async login(loginDto: LoginDto): Promise<ILogin> {
		const user: User | undefined = await this.userRepository.findOne({
			id: loginDto.id,
			pw: hashPassword(loginDto.pw),
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
		const data: User | undefined = await this.userRepository.findOne({
			where: {
				phone: phone
			}
		});

		if (data === undefined) {
			throw new NotFoundException('존재하지 않는 전화번호');
		}

		return data;
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

	async getMyInfoByNameAndBirth(name: string, birth: string): Promise<User> {
		const data: User | undefined = await this.userRepository.findOne({
			where: {
				nick: name,
				birth: birth
			}
		});

		if (data === undefined) {
			throw new NotFoundException('존재하지 않는 유저');
		}

		return data;
	}
}

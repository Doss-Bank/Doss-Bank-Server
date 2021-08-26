import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User';
import { Repository } from 'typeorm';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import crypto, { createHash } from 'crypto';
import { generateAuthToken } from 'src/lib/token';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) { }

	async register(registerDto: RegisterDto): Promise<void> {
		let user: User | undefined;
		try {
			user = await this.userRepository.findOne({
				where: {
					id: registerDto.id,
				}
			});
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException('서버오류');
		}

		if (user !== undefined) {
			throw new UnauthorizedException('이미 존재하는 아이디입니다');
		}

		const hash: string = await this.hashPW(registerDto.pw);

		this.userRepository.save({
			id: registerDto.id,
			pw: hash,
			nick: registerDto.nick,
			birth: registerDto.birth,
			phone: registerDto.phone
		});
	}

	async login(loginDto: LoginDto): Promise<string> {
		let user: User | undefined;
		try {
			const hash: string = await this.hashPW(loginDto.pw);
			user = await this.userRepository.findOne({
				id: loginDto.id,
				pw: hash
			});
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException('서버 오류');
		}
		if (user === undefined) {
			throw new NotFoundException('존재하지 않는 유저입니다');
		}

		return generateAuthToken(user.id);
	}

	async hashPW(pw: string): Promise<string> {
		return createHash('sha512').update(pw).digest('base64');
	}

	async getMyInfo(userId: string): Promise<User> {
		return this.userRepository.findOne({
			where: {
				id: userId
			},
			relations: ['account']
		})
	}
}

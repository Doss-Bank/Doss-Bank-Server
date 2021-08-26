import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import User from 'src/entities/User';
import { Token } from 'src/lib/token';
import { PasswordGuard } from 'src/middleware/authMiddleware';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
	constructor(
		private userService: UserService,
	) { }

	@Post('/register')
	@HttpCode(200)
	@ApiOperation({ summary: '회원가입' })
	async Register(@Body() registerDto: RegisterDto) {
		await this.userService.register(registerDto);

		return {
			status: 200,
			messgae: '회원가입 성공'
		}
	}

	@Post('/login')
	@HttpCode(200)
	@ApiOperation({ summary: '로그인' })
	async Login(@Body() loginDto: LoginDto) {
		const token: string = await this.userService.login(loginDto);

		return {
			token,
			status: 200,
			message: '로그인 성공'
		}
	}

	@Get('/')
	@HttpCode(200)
	@ApiOperation({ summary: '나의 정보 조회' })
	@ApiBearerAuth('x-access-token')
	@UseGuards(new PasswordGuard())
	async getMyInfo(@Token() user: User) {
		const data: User = await this.userService.getMyInfo(user.phone);

		return {
			data,
			status: 200,
			message: '나의 정보 조회 성공'
		}
	}

}

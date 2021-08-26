import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import User from 'src/entities/User';
import { Token } from 'src/lib/token';
import { AuthGuard } from 'src/middleware/authMiddleware';
import PasswordDto from './dto/passwordDto';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {
	constructor(
		private passwordService: PasswordService,
	) { }

	@Post('/')
	@HttpCode(200)
	@UseGuards(new AuthGuard())
	async makePassword(@Token() user: User, @Body() passwordDto: PasswordDto) {
		await this.passwordService.makePassword(user, passwordDto);

		return {
			status: 200,
			message: '비번 생성 성공',
		}
	}

	@Get('/')
	@HttpCode(200)
	@UseGuards(new AuthGuard())
	async isHavePassword(@Token() user: User) {
		const isHave: boolean = await this.passwordService.isHavePW(user);

		return {
			isHave,
			status: 200,
			message: '비번 조회 성공'
		}
	}

	@Post('/login')
	@HttpCode(200)
	@UseGuards(new AuthGuard())
	async loginInSimplePassword(@Token() user: User, @Body() passwordDto: PasswordDto) {
		const token: string = await this.passwordService.login(user, passwordDto);

		return {
			token,
			status: 200,
			mesage: '로그인 성공'
		}
	}
}

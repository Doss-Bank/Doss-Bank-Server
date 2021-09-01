import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import User from 'src/entities/User';
import { Token } from 'src/lib/token';
import { PasswordGuard } from 'src/middleware/authMiddleware';
import TransferDto from './dto/transferDto';
import { TransferService } from './transfer.service';

@Controller('transfer')
@ApiTags('transfer')
export class TransferController {
	constructor(
		private transService: TransferService,
	) { }

	@Post('/send')
	@HttpCode(200)
	async sendMoney(@Body() transferDto: TransferDto) {
		await this.transService.sendMoney(transferDto);

		return {
			status: 200,
			message: '송금 완료'
		}
	}

	@Post('/get')
	@HttpCode(200)
	async getMoney(@Body() transferDto: TransferDto) {
		await this.transService.getMoney(transferDto);

		return {
			status: 200,
			message: '수신 완료'
		}
	}
}

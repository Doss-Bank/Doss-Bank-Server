import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import User from 'src/entities/User';
import { Token } from 'src/lib/token';
import { PasswordGuard } from 'src/middleware/authMiddleware';
import TransferDto from './dto/transferDto';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
	constructor(
		private transService: TransferService,
	) { }

	@Post('/')
	@HttpCode(200)
	@UseGuards(new PasswordGuard())
	async sendMoney(@Token() user: User, @Body() transferDto: TransferDto) {

	}
}

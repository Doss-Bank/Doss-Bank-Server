import { Injectable } from '@nestjs/common';
import Account from 'src/entities/Account';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AccountDto from './dto/accountDto';

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(Account)
		private accountRepo: Repository<Account>
	) { }

	async createAccount(data: AccountDto): Promise<void> {

	}
}

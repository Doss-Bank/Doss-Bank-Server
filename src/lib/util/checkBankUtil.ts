import { BadRequestException } from "@nestjs/common";
import { TransferTo } from "src/enum/account";

export default (account: string): TransferTo => {
	const bankCode = account.split('-');

	if (bankCode[0].length < 3) {
		throw new BadRequestException('올바르지 않은 계좌번호입니다');
	}

	switch (bankCode[0]) {
		case '001':
			return TransferTo.Jungbin;
		case '002':
			return TransferTo.Haeyoon;
		case '003':
			return TransferTo.Minkyun;
		case '004':
			return TransferTo.Jungmin;
	}
}
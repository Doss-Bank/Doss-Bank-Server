import { BadRequestException } from '@nestjs/common';
import { BringAccountInfo, Take, TransferTo } from 'src/enum/account';

export default (account: string, type: number): any => {
  const bankCode: string = account.slice(0, 3);

  if (bankCode.length < 3) {
    throw new BadRequestException('올바르지 않은 계좌번호입니다');
  }

  if (type === 0) {
    switch (bankCode) {
      case '001':
        return TransferTo.KaKao;
      case '002':
        return TransferTo.Toss;
      case '003':
        return TransferTo.Minkyun;
    }
  } else if (type === 1) {
    switch (bankCode) {
      case '001':
        return BringAccountInfo.KaKao;
    }
  } else if (type === 2) {
    switch (bankCode) {
      case '001':
        return 'KaKao';
    }
  } else if (type === 3) {
    switch (bankCode) {
      case '001':
        return Take.KaKao;
      case '002':
        return Take.Toss;
    }
  }
};

export const checkBankByNum = (num: number) => {
  switch (num) {
    case 1:
      return TransferTo.KaKao;
    case 2:
      return TransferTo.Toss;
  }
};

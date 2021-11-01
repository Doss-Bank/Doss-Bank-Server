import { NotFoundException } from '@nestjs/common';

export const validateData = (data: any): void => {
  if (data === undefined || data === null) {
    throw new NotFoundException('데이터가 없어용');
  }
};

export const isDefined = (data: any): boolean => {
  if (data === undefined || data === null) {
    return false;
  }

  return true;
};

import { NotFoundException } from '@nestjs/common';

export const validateData = (data: Object): void => {
  if (data === undefined || data === null) {
    throw new NotFoundException('데이터가 없어용');
  }
};

export const isDefined = (data: Object): boolean => {
  if (data === undefined || data === null) {
    return false;
  }

  return true;
};

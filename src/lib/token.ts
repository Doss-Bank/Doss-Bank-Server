import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JWT_SECRET } from '../config/config';

export const Token = createParamDecorator(
  (data, ctx: ExecutionContext): ParameterDecorator => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

export const generateAccessToken = (phone: string): string => {
  const payload = {
    phone,
  };

  const option: JwtSignOptions = {
    issuer: 'Doss',
    subject: 'token',
  }

  return jwt.sign(payload, JWT_SECRET);
};

export const decodedToken = (token: string) => {
  return jwt.decode(token);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

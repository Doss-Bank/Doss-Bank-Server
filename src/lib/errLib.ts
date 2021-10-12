import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { EventEmitter2 } from 'eventemitter2';
import { Request, Response } from 'express';
import { SseConst } from 'src/enum/sse';
import { ErrorEvent } from 'src/error/ErrorEvent';

@Catch()
export default class CatchException implements ExceptionFilter {
  constructor(
    private eventEmitter: EventEmitter2,
  ) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    let httpError = null;
    console.log(exception);

    if (exception instanceof HttpException) {
      const errorEvent = new ErrorEvent();
      errorEvent.ip = request.ip;
      errorEvent.status = exception.getStatus();
      errorEvent.message = exception.message;

      this.eventEmitter.emit(
        SseConst.ERROR,
        errorEvent,
      );

      httpError = {
        status: exception.getStatus(),
        message: exception.message,
      };
    } else {
      httpError = {
        status: 500,
        message: '서버 오류입니다.',
      };
    }

    const { status, message } = httpError;
    return response.status(status).json({
      status,
      message,
    });
  }
}

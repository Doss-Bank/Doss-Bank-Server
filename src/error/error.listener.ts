import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SseConst } from 'src/enum/sse';
import { SseService } from 'src/sse/sse.service';
import { ErrorEvent } from './ErrorEvent';

@Injectable()
export class ErrorListener {
  constructor(public sseService: SseService) {}

  @OnEvent(SseConst.ERROR)
  handleError(event: ErrorEvent) {
    this.sseService.addEvent({
      type: SseConst.ERROR,
      data: event,
    });
  }
}

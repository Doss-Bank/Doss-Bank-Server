import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private events: Subject<MessageEvent> = new Subject<MessageEvent>();

  addEvent(event: MessageEvent) {
    this.events.next(event);
  }

  sendEvents() {
    return this.events.asObservable();
  }
}

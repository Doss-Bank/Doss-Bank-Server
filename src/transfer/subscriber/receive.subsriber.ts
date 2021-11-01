import { Injectable } from '@nestjs/common';
import Receive from 'src/entities/Receive';
import { SseConst } from 'src/enum/sse';
import { SseService } from 'src/sse/sse.service';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class ReceiveSubscriber implements EntitySubscriberInterface<Receive> {
  constructor(connection: Connection, private sseService: SseService) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Receive;
  }

  afterInsert(event: InsertEvent<Receive>) {
    this.sseService.addEvent({
      type: SseConst.RECEIVE,
      data: event.entity,
    });
  }
}

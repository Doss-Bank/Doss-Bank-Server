import { Injectable } from "@nestjs/common";
import { SseConst } from "src/enum/sse";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { SseService } from "../../sse/sse.service";
import Send from "../../entities/Send";

@Injectable()
@EventSubscriber()
export class SendSubscriber implements EntitySubscriberInterface<Send> {

	constructor(
		connection: Connection,
		private sseService: SseService,
	) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return Send;
	}

	afterInsert(event: InsertEvent<Send>) {
		this.sseService.addEvent({
			type: SseConst.SEND,
			data: event.entity
		});
	}
}
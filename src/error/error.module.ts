import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SseModule } from "src/sse/sse.module";
import { ErrorListener } from "./error.listener";

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		SseModule,
	],
	providers: [ErrorListener],
})
export class ErrorModule { }
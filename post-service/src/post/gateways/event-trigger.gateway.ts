import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class EventTrigger {
    constructor(
        @Inject('RMQ_SERVICE') private readonly rabbitMq: ClientProxy
    ) { }

    async trigger<T>(eventName: string, eventData: T) {
        this.rabbitMq.emit<T>(eventName, eventData);
        return "Event triggered";
    }
}
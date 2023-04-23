import { Controller } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {

    constructor(private readonly eventService: EventsService) { }

    @EventPattern('add_comment', Transport.RMQ)
    addPostComment(data: any) {
        this.eventService.addPostComment(data);
    }

    @EventPattern('delete_comment', Transport.RMQ)
    deletePostComment(data: any) {
        this.eventService.deletePostComment(data);
    }
}

import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PostGateway } from './gateways/post.gateway';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EventsService, PostGateway],
  controllers: [EventsController]
})
export class EventsModule { }

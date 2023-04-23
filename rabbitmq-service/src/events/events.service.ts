import { Injectable } from '@nestjs/common';
import { PostGateway } from './gateways/post.gateway';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DeleteCommentDto } from './dtos/delete-comment.dto';

@Injectable()
export class EventsService {
    constructor(private readonly postGateway: PostGateway) { }

    addPostComment(data: CreateCommentDto) {
        this.postGateway.addPostComment(data);
    }

    deletePostComment(data: DeleteCommentDto) {
        this.postGateway.deletePostComment(data);
    }
}

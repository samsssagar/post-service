import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { IComment } from './interfaces/comment.interface';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @HttpCode(201)
    async createComment(createCommentDto: CreateCommentDto): Promise<IComment> {
        return await this.commentService.createComment(createCommentDto);
    }

    @Get(":postId")
    @HttpCode(200)
    async getPostComments(@Param('postId') postId: string): Promise<IComment[]> {
        return this.commentService.fetchPostComment(postId);
    }

    @Delete(":id")
    @HttpCode(200)
    async deleteComment(@Param('id') id: string): Promise<IComment> {
        return this.commentService.deleteCommentById(id);
    }

}

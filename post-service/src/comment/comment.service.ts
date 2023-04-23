import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { IComment } from './interfaces/comment.interface';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Types } from 'mongoose';

@Injectable()
export class CommentService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<IComment>) { }

    async createComment(createCommentDto: CreateCommentDto): Promise<IComment> {
        return await new this.commentModel(createCommentDto).save();
    }

    async fetchPostComment(postId: string): Promise<IComment[]> {
        const commentData = await this.commentModel.find({ postId: postId });
        if (!commentData) throw new NotFoundException(`No comment found for post with id: ${postId}`);
        return commentData;
    }

    async deleteCommentById(commentId: string): Promise<IComment> {
        const commentData = await this.commentModel.findByIdAndDelete(commentId);
        if (!commentData) throw new NotFoundException(`No comment found with id: ${commentId}`);
        return commentData;
    }

    async deleteCommentByPostId(postIds: string[]): Promise<void> {
        await this.commentModel.deleteMany({ postId: postIds });
    }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from '../post.service';
import { IPostResponse } from '../interfaces/post.interface';

@Injectable()
export class DeletePostGuard implements CanActivate {
    constructor(private reflector: Reflector, private postService: PostService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const postIds: string[] = request.body;
        const createdBy = request.user.username;

        const postResult = await this.postService.findPostsByFilters({ createdBy: createdBy });
        return arePostIdsCreatedByUser(postIds, postResult);
    }
}

function arePostIdsCreatedByUser(postIds: string[], userPosts: IPostResponse[]): boolean {
    const createdBy = userPosts[0]?.createdBy;
    return postIds.every((postId) => {
        const post = userPosts.find((p) => p.id.toString() === postId);
        return post && post.createdBy === createdBy;
    });
}
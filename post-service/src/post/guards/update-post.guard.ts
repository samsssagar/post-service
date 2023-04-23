import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from '../post.service';

@Injectable()
export class UpdatePostGuard implements CanActivate {
    constructor(private reflector: Reflector, private postService: PostService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const postId = request.params.id;
        const createdBy = request.user.username;

        const postResult = await this.postService.findPostsByFilters({ createdBy: createdBy });
        const post = postResult.filter(p => p.id.toString() === postId)[0];

        if (!post) {
            return false;
        }

        return post.createdBy === createdBy;
    }
}
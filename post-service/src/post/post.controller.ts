import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { IPostResponse } from './interfaces/post.interface';
import { PostFilterDto } from './dtos/post-filters.dto';
import { CreatePostRequestDto } from './dtos/create-post-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './filters/image.filter';
import { UpdatePostRequestDto } from './dtos/update-post-request.dto';
import { UpdatePostGuard } from './guards/update-post.guard';
import { DeletePostGuard } from './guards/delete-post.guard';
import { EventPattern, Transport } from '@nestjs/microservices';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DeleteCommentDto } from './dtos/delete-comment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    async fetchAllPosts(): Promise<IPostResponse[]> {
        return await this.postService.fetchAllPosts();
    }

    @Get(":title")
    @Public()
    @HttpCode(HttpStatus.OK)
    async fetchByTitle(@Param('title') title: string): Promise<IPostResponse> {
        return await this.postService.fetchPostByTitle(title);
    }

    @Post("filter")
    @Public()
    @HttpCode(HttpStatus.OK)
    async filterPosts(@Body() filterObj: PostFilterDto): Promise<IPostResponse[]> {
        return await this.postService.findPostsByFilters(filterObj);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: fileFilter
    }))
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Request() req, @Body() createPost: CreatePostRequestDto, @UploadedFile() file: Express.Multer.File): Promise<IPostResponse> {
        return await this.postService.createPost(
            {
                title: createPost.title,
                description: createPost.description,
                tags: createPost.tags ? JSON.parse(createPost.tags) : [],
                image: file.buffer,
                createdBy: req.user.username,
                createdOn: new Date(new Date().toUTCString()),
                updatedOn: new Date(new Date().toUTCString())
            });
    }

    @Put(":id")
    @HttpCode(HttpStatus.OK)
    @UseGuards(UpdatePostGuard)
    async updatePost(@Param("id") id: string, @Body() updatePostDto: UpdatePostRequestDto): Promise<IPostResponse> {
        return await this.postService.updatePost(id, {
            title: updatePostDto.title,
            description: updatePostDto.description,
            tags: updatePostDto.tags,
            updatedOn: new Date(new Date().toUTCString())
        });
    }

    @Delete("delete/ids")
    @HttpCode(HttpStatus.OK)
    @UseGuards(DeletePostGuard)
    async deleteByIds(@Body() deletePostIds: string[]): Promise<number> {
        return await this.postService.deletePostByIds(deletePostIds);
    }

    @Post('events/:eventType')
    async triggerEvents(@Param('eventType') eventType: string, @Body() body) {
        await this.postService.triggerEvents(eventType, body);
    }

    @Public()
    @Post('add/comment')
    async addComment(@Body() commentCounterDto: CreateCommentDto) {
        await this.postService.incrementCommentCounter(commentCounterDto);
    }

    @Public()
    @Post('delete/comment')
    async deleteComment(@Body() commentCounterDto: DeleteCommentDto) {
        await this.postService.decrementCommentCounter(commentCounterDto);
    }
}
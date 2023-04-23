import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IPost, IPostResponse } from './interfaces/post.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostFilterDto } from './dtos/post-filters.dto';
import { TagMiddleware } from './middleware/tag.middleware';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dtos/create-post.dto';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DeleteCommentDto } from './dtos/delete-comment.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<IPost>,
        private readonly tagMiddleware: TagMiddleware,
        private readonly commentService: CommentService,
        @Inject('RMQ_SERVICE') private readonly rabbitMq: ClientProxy
    ) { }

    async fetchAllPosts(): Promise<IPostResponse[]> {
        const postData = await this.postModel.find().sort({ createdOn: -1 }).exec();
        if (!postData) throw new NotFoundException(`No Posts found`);
        let response: IPostResponse[] = [];
        for (let i = 0; i < postData.length; i++) {
            response.push(
                {
                    id: postData[i]._id,
                    title: postData[i].title,
                    description: postData[i].description,
                    tags: postData[i].tags,
                    commentCounter: postData[i].commentCounter,
                    createdBy: postData[i].createdBy,
                    createdOn: postData[i].createdOn,
                    image: postData[i].image.toString('base64'),
                    updatedOn: postData[i].updatedOn
                }
            )
        }
        return response;
    }

    async fetchPostByTitle(title: string): Promise<IPostResponse> {
        const postData = await this.postModel.findOne({ title }).exec();
        if (!postData) throw new NotFoundException(`Post with title ${title} not found`);
        return {
            id: postData._id,
            title: postData.title,
            description: postData.description,
            createdOn: postData.createdOn,
            updatedOn: postData.updatedOn,
            commentCounter: postData.commentCounter,
            createdBy: postData.createdBy,
            image: postData.image.toString('base64'),
            tags: postData.tags
        };
    }

    async findPostsByFilters(filterDto: PostFilterDto): Promise<IPostResponse[]> {
        const { title, tags, createdBy, startDate, endDate } = filterDto;
        const query: { title?: any, tags?: any, createdBy?: string, createdOn?: any } = {};

        if (filterDto.title) query.title = { '$regex': `^${title}$`, '$options': 'i' };

        if (filterDto.tags && filterDto.tags.length > 0) query.tags = { "$in": tags };

        if (filterDto.createdBy) query.createdBy = createdBy;

        if (filterDto.startDate && filterDto.endDate) {
            query.createdOn = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.createdOn = { $gte: startDate };
        } else if (endDate) {
            query.createdOn = { $lte: endDate };
        }

        const posts = await this.postModel.find(query).sort({ createdAt: 'desc' }).exec();

        let response: IPostResponse[] = [];

        for (let i = 0; i < posts.length; i++) {
            response.push(
                {
                    id: posts[i]._id,
                    title: posts[i].title,
                    description: posts[i].description,
                    tags: posts[i].tags,
                    commentCounter: posts[i].commentCounter,
                    createdBy: posts[i].createdBy,
                    createdOn: posts[i].createdOn,
                    image: posts[i].image.toString('base64'),
                    updatedOn: posts[i].updatedOn
                }
            )
        }

        return response;
    }

    async createPost(createPostDto: CreatePostDto): Promise<IPostResponse> {
        const newPostData = await new this.postModel(createPostDto).save();
        if (newPostData.tags) await this.tagMiddleware.updateTagCount(newPostData.tags);
        return {
            id: newPostData._id,
            title: newPostData.title,
            description: newPostData.description,
            createdOn: newPostData.createdOn,
            updatedOn: newPostData.updatedOn,
            commentCounter: newPostData.commentCounter,
            createdBy: newPostData.createdBy,
            image: newPostData.image.toString('base64'),
            tags: newPostData.tags
        };
    }

    async updatePost(postId: string, updatePostDto: UpdatePostDto): Promise<IPostResponse> {
        const postToUpdate = await this.postModel.findById(postId).exec();
        const existingPost = await this.postModel.findByIdAndUpdate(postId, updatePostDto, { new: true }).exec();
        if (!existingPost) throw new NotFoundException(`Post ${postId} not found`);
        const addedTags = existingPost.tags.filter(tag => !postToUpdate.tags.includes(tag));
        const deletedTags = postToUpdate.tags.filter(tag => !existingPost.tags.includes(tag));
        if (addedTags.length > 0) this.tagMiddleware.updateTagCount(addedTags);
        if (deletedTags.length > 0) this.tagMiddleware.deleteTagCount(deletedTags);
        return {
            id: existingPost._id,
            title: existingPost.title,
            description: existingPost.description,
            createdOn: existingPost.createdOn,
            updatedOn: existingPost.updatedOn,
            commentCounter: existingPost.commentCounter,
            createdBy: existingPost.createdBy,
            image: existingPost.image.toString('base64'),
            tags: existingPost.tags
        };
    }

    async deletePostByIds(postIds: string[]): Promise<number> {
        const postsToDelete = await this.postModel.find({ _id: postIds }).exec();
        const existingPosts = await this.postModel.deleteMany({ _id: postIds }).exec();
        if (existingPosts.deletedCount === 0) throw new NotFoundException(`No post found`);
        const tags = [...new Set(postsToDelete.flatMap(obj => obj.tags))];
        await this.tagMiddleware.deleteTagCount(tags);
        this.commentService.deleteCommentByPostId(postIds);
        return existingPosts.deletedCount;
    }

    async decrementCommentCounter(comment: DeleteCommentDto): Promise<void> {
        const currPost = await this.postModel.findById(comment.postId).exec();
        const post = await this.postModel.updateOne(
            { title: currPost.title },
            { $inc: { commentCounter: -1 } },
            { upsert: true },
        ).exec();
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (currPost.commentCounter > 0) {
            await this.commentService.deleteCommentById(comment.commentId);
        }
    }

    async incrementCommentCounter(comment: CreateCommentDto): Promise<void> {
        const currPost = await this.postModel.findById(comment.postId).exec();
        const post = await this.postModel.updateOne(
            { title: currPost.title },
            { $inc: { commentCounter: 1 } },
            { upsert: true },
        ).exec();
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        await this.commentService.createComment({ postId: currPost._id, text: comment.text });
    }

    async triggerEvents<T>(eventName: string, eventData: T): Promise<string> {
        this.rabbitMq.emit<T>(eventName, eventData);
        return "Events triggered";
    }

}

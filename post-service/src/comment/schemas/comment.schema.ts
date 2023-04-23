import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Post } from "src/post/schema/post.schema";

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
    @Prop()
    text: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
    postId: Post;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Tag } from "src/tag/schema/tag.schema";

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ required: true })
    createdOn: Date;

    @Prop()
    updatedOn: Date;

    @Prop({ default: [] })
    tags: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' })
    tagObjects: Tag[];

    @Prop({ default: 0 })
    commentCounter: number;

    @Prop({ type: Buffer, required: true })
    image: Buffer;
}

export const PostSchema = SchemaFactory.createForClass(Post);
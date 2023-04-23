import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ITag } from "src/tag/interfaces/tag.interface";
import { Tag } from "src/tag/schema/tag.schema";
import { IPost } from "../interfaces/post.interface";

@Injectable()
export class TagMiddleware {
    constructor(
        @InjectModel(Tag.name) private tagModel: Model<ITag>
    ) { }

    async updateTagCount(tags: string[]): Promise<void> {
        for (const tagName of tags) {
            await this.tagModel.findOneAndUpdate(
                { name: tagName },
                { $inc: { count: 1 } },
                { upsert: true },
            );
        }
    }

    async deleteTagCount(tags: string[]): Promise<void> {
        for (const tagName of tags) {
            await this.tagModel.findOneAndUpdate(
                { name: tagName },
                { $inc: { count: -1 } }
            )
        };
        await this.tagModel.deleteMany({ count: { $lte: 0 } }).exec();
    }
}
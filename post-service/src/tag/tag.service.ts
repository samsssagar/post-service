import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from './schema/tag.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ITag } from './interfaces/tag.interface';
import { Model } from 'mongoose';

@Injectable()
export class TagService {
    constructor(@InjectModel(Tag.name) private tagModel: Model<ITag>) { }

    async fetchTagCounter(tagId: string): Promise<{ name: string, postTagged: number }> {
        const tagData = await this.tagModel.findById(tagId);
        if (!tagData) throw new NotFoundException(`Tag with ${tagId} not found`);
        return { name: tagData.name, postTagged: tagData.count };
    }
}

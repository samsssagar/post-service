import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
    @Prop({ unique: true })
    name: string;

    @Prop({ default: 0 })
    count: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
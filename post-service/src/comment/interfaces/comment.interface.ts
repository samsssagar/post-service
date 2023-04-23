import { Document } from "mongoose";

export interface IComment extends Document {
    readonly text: string;
    readonly postId: string;
}
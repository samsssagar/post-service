import { Document } from "mongoose";

export interface IPost extends Document {
    readonly title: string;
    readonly description: string;
    readonly createdOn: Date;
    readonly updatedOn: Date;
    readonly createdBy: string;
    readonly tags: string[];
    readonly commentCounter: number;
    readonly image: Buffer;
}

export interface IPostResponse {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    createdBy: string;
    tags: string[];
    commentCounter: number;
    image: string;
}
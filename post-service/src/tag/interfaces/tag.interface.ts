import { Document } from "mongoose";

export interface ITag extends Document {
    readonly name: string;
    readonly count: number;
}
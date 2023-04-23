import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {

    @IsNotEmpty()
    @IsString()
    commentText: string;

    @IsNotEmpty()
    @IsString()
    commentId: string;

    @IsNotEmpty()
    @IsString()
    postId: string;
}
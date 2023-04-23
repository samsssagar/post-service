import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    readonly text: string;

    @IsString()
    @IsNotEmpty()
    readonly postId: string;
}
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreatePostRequestDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 3000)
    readonly description: string;

    @IsString()
    @IsOptional()
    readonly tags: string;
}
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdatePostRequestDto {

    @IsString()
    @Length(3, 20)
    readonly title?: string;

    @IsString()
    @Length(10, 3000)
    readonly description?: string;

    @IsString({ each: true })
    readonly tags?: string[];
}
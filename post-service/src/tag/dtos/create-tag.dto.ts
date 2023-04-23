import { IsArray, IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTagDto {

    @IsString()
    readonly name: string;

}
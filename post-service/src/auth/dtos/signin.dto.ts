import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignInDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
import { IsDateString, IsOptional, IsString } from "class-validator";

export class PostFilterDto {

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    createdBy?: string;

    @IsOptional()
    @IsDateString({ strict: true })
    startDate?: string;

    @IsOptional()
    @IsDateString({ strict: true })
    endDate?: string;

}
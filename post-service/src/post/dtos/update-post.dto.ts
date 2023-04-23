import { PartialType } from "@nestjs/mapped-types";

export class UpdatePostDto {
    title: string;
    description: string;
    tags: string[];
    updatedOn: Date;
}
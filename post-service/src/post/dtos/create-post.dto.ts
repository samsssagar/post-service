export class CreatePostDto {
    title: string;
    description: string;
    tags: string[];
    createdOn: Date;
    updatedOn: Date;
    createdBy: string;
    image: Buffer;
}
import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Get("/postCount/:id")
    async getPostCountByTag(@Param('id') id: string): Promise<{ name: string; postTagged: number; }> {
        return await this.tagService.fetchTagCounter(id);
    }

}

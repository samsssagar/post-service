import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Public()
    async createUser(
        @Body('password') password: string,
        @Body('username') username: string,
    ): Promise<IUser> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const result = await this.usersService.createUser(
            username,
            hashedPassword,
        );
        return result;
    }

    @Get(":name")
    async getUser(@Param("name") name: string): Promise<IUser> {
        const res = await this.usersService.getUser(name);
        return res;
    }
}

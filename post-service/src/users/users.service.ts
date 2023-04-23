import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<IUser>) { }

    async createUser(username: string, password: string): Promise<IUser> {
        return await this.userModel.create({
            username,
            password,
        });
    }

    async getUser(username: string): Promise<IUser> {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new NotFoundException(`User with username "${username}" not found`);
        }
        return user;
    }
}
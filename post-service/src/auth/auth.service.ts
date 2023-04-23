import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<IUser> {
        const user = await this.usersService.getUser(username);
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) throw new NotAcceptableException('User was not found');
        if (user && passwordValid) return user;
    }

    async login(userDetails: any): Promise<{ access_token: string }> {
        const user = await this.validateUser(userDetails.username, userDetails.password);
        const payload = { username: userDetails.username, sub: userDetails._id };
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_KEY }),
        };
    }

}
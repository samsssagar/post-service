import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private userService: UsersService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: any): Promise<any> {
        let username: string = payload.username;
        const user = await this.userService.getUser(username);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

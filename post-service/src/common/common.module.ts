import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
    imports: [],
    controllers: [],
    providers: [],
})
export class CommonModule { }

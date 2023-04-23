import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../constants/constants';

@Injectable()
export class PostGateway {
    baseUrl = process.env.POST_BASE_URL;

    constructor(private readonly http: HttpService,
    ) { }

    async addPostComment(body: any) {
        try {
            const result = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}${Constants.ADD_COMMENT_BASEURL}`,
                    body
                ),
            );
            return result.status === 200 ? result.data : null;
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async deletePostComment(body: any) {
        try {
            const result = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}${Constants.DELETE_COMMENT_BASEURL}`,
                    body
                ),
            );
            return result.status === 200 ? result.data : null;
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}

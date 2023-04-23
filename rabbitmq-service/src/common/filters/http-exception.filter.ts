import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    UnprocessableEntityException,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor() { }

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const message =
            exception instanceof Error ? exception.message : exception.message.error;
        console.error(exception);
        if (exception instanceof UnprocessableEntityException) {
            let message = exception.getResponse() as {
                key: string;
                field: string;
            };
            const field = message.field;
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: { [field]: message },
                statusCode: HttpStatus.BAD_REQUEST,
                timestamp: new Date().toISOString(),
            });
        }

        response
            .status(
                exception.status === undefined
                    ? HttpStatus.INTERNAL_SERVER_ERROR
                    : exception.status,
            )
            .json({
                statusCode: exception.status,
                error: message,
                timestamp: new Date().toISOString(),
                message:
                    exception.status === HttpStatus.INTERNAL_SERVER_ERROR
                        ? 'Sorry we are experiencing technical problems.'
                        : '',
            });
    }
}
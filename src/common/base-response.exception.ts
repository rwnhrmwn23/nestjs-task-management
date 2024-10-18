import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseResponse } from './base-response';

@Catch()
export class BaseResponseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as any)
        : { message: 'Internal server error' };

    const message = Array.isArray(errorResponse.message)
      ? errorResponse.message.join(', ')
      : errorResponse.message;

    const baseErrorResponse: BaseResponse<any> = {
      statusCode: status,
      message: message,
      data: null,
    };

    response.status(200).json(baseErrorResponse);
  }
}

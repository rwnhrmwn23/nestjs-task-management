import {
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { BaseResponse } from './base-response';

export async function executeQueryWithLogging<T>(
  logger: Logger,
  user: string,
  nameFunction: string,
  successMessage = 'Operation successful',
  action: () => Promise<T>,
): Promise<BaseResponse<T>> {
  try {
    const result = await action();

    return {
      statusCode: 200,
      message: successMessage,
      data: result,
    };
  } catch (error) {
    logger.error(
      `Failed to execute query in ${nameFunction} for user "${user}". Error: ${error.message}`,
    );

    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException();
  }
}

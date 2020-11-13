import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const message = exception.message;

    Logger.log(`Caught Exception: ${message}`);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const error =
        typeof exceptionResponse === 'string'
          ? { message: [exceptionResponse] }
          : (exceptionResponse as object & { message: string | string[] });

      if (typeof error.message === 'string') {
        error.message = [error.message];
      }

      return response.status(status).json({
        ...error,
        timestamp: new Date().toISOString(),
      });
    }

    response
      .status(message === 'Unauthorized' ? 403 : 500)
      .json({ message: [message] });
  }
}

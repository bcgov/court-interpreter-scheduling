import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;
    Logger.log(`Caught Exception: ${message}`);
    response
      .status(message === 'Unauthorized' ? 403 : 500)
      .json({ error: { message } });
  }
}

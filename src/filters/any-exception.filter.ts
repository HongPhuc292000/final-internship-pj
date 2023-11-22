import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  HttpExceptionBody,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'unknown error';
    if (exception instanceof HttpException) {
      const exceptionBody = exception.getResponse() as {
        message?: string;
        error?: string;
      };
      status = exception.getStatus() || status;
      error = exceptionBody?.error || error;
      message = exceptionBody?.message || message;
    }
    if (exception instanceof QueryFailedError) {
      error = 'Query error';
      message = exception.message;
    }
    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: error,
    });
  }
}

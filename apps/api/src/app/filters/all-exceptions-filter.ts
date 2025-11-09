/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';

interface ErrorResponse {
  message: string;
  status: number;
}

enum PostgresErrorCode {
  UniqueViolation = '23505',
  CheckViolation = '23514',
  NotNullViolation = '23502',
  ForeignKeyViolation = '23503',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      let errorResponse: ErrorResponse;

      if (exception instanceof HttpException) {
        const raw = exception.getResponse() as any;
        const normalizedMessage =
          typeof raw?.message === 'string'
            ? raw.message
            : Array.isArray(raw?.message)
            ? 'Validation failed'
            : raw?.message ?? 'Bad request';

        errorResponse = {
          status: exception.getStatus(),
          message: normalizedMessage,
        };
      } else if (exception instanceof QueryFailedError) {
        errorResponse = this.handleQueryExceptions(exception);
      } else {
        errorResponse = {
          message: 'Internal server error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      response.status(errorResponse.status).json({
        statusCode: errorResponse.status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorResponse.message,
      });
    } catch (error) {
      console.error('Error in AllExceptionsFilter:', error);
    }
  }

  private handleQueryExceptions(exception: any): ErrorResponse {
    const code: string | undefined = exception?.code;

    let status = HttpStatus.UNPROCESSABLE_ENTITY;
    let message = 'Database error.';

    switch (code) {
      case PostgresErrorCode.UniqueViolation:
        status = HttpStatus.CONFLICT;
        message = 'This record already exists.';
        break;

      case PostgresErrorCode.NotNullViolation:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'A required field is missing.';
        break;

      case PostgresErrorCode.ForeignKeyViolation:
        status = HttpStatus.CONFLICT;
        message = 'Related item not found.';
        break;

      case PostgresErrorCode.CheckViolation:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'Please check the entered values.';
        break;

      default:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'Could not process your request.';
        break;
    }

    return { message, status };
  }
}

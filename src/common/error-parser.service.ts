import { Injectable } from '@nestjs/common';

export interface ParsedError {
  title: string;
  message: string;
  code: string | number;
  details?: any;
}

@Injectable()
export class ErrorParserService {
  parseError(error: any): ParsedError {
    // Default values
    let title = 'Internal Server Error';
    let message = 'An unexpected error occurred.';
    let code: string | number = 500;
    let details: any = undefined;

    // NestJS HttpException
    if (error && error.getStatus && error.getResponse) {
      code = error.getStatus();
      const response = error.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object') {
        message = response.message || message;
        title = response.error || title;
        details = response.details;
      }
    }
    // Mongoose/MongoDB error
    else if (error && error.name === 'MongoError') {
      code = error.code || 500;
      title = error.name;
      message = error.message;
      details = error;
    }
    // Validation error
    else if (error && error.name === 'ValidationError') {
      code = 400;
      title = error.name;
      message = error.message;
      details = error.errors;
    }
    // Custom error
    else if (error && error.message) {
      message = error.message;
      title = error.name || title;
      code = error.code || code;
      details = error.details;
    }

    return { title, message, code, details };
  }
}

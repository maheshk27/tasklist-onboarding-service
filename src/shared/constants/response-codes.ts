import { HttpStatus } from '@nestjs/common';

export interface ResponseCode {
  code: string;
  message: string;
  statusCode: HttpStatus;
}

export const BaseResponseCodes = {
  SUCCESS: {
    code: 'SUCCESS',
    message: 'Operation completed successfully',
    statusCode: HttpStatus.OK
  },
  CREATED: {
    code: 'CREATED',
    message: 'Resource created successfully',
    statusCode: HttpStatus.CREATED
  },
  UPDATED: {
    code: 'UPDATED',
    message: 'Resource updated successfully',
    statusCode: HttpStatus.OK
  },
  DELETED: {
    code: 'DELETED',
    message: 'Resource deleted successfully',
    statusCode: HttpStatus.OK
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    statusCode: HttpStatus.BAD_REQUEST
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  CONFLICT: {
    code: 'CONFLICT',
    message: 'Resource already exists',
    statusCode: HttpStatus.CONFLICT
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    statusCode: HttpStatus.UNAUTHORIZED
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Access denied',
    statusCode: HttpStatus.FORBIDDEN
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'Bad request',
    statusCode: HttpStatus.BAD_REQUEST
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service temporarily unavailable',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE
  }
} as const;

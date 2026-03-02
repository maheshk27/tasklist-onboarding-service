import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const AuthResponseCodes = {
  ...BaseResponseCodes,
  
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid username or password',
    statusCode: HttpStatus.UNAUTHORIZED
  },
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists',
    statusCode: HttpStatus.CONFLICT
  },
  REGISTRATION_SUCCESS: {
    code: 'REGISTRATION_SUCCESS',
    message: 'User registered successfully',
    statusCode: HttpStatus.CREATED
  },
  LOGIN_SUCCESS: {
    code: 'LOGIN_SUCCESS',
    message: 'Login successful',
    statusCode: HttpStatus.OK
  },
  ADMIN_ROLE_NOT_FOUND: {
    code: 'ADMIN_ROLE_NOT_FOUND',
    message: 'Admin role not found in database',
    statusCode: HttpStatus.NOT_FOUND
  },
  ADMIN_ALREADY_EXISTS: {
    code: 'ADMIN_ALREADY_EXISTS',
    message: 'Admin user already exists, registration closed',
    statusCode: HttpStatus.CONFLICT
  },
  ADMIN_REGISTRATION_CLOSED: {
    code: 'ADMIN_REGISTRATION_CLOSED',
    message: 'Admin registration is closed, use user creation API',
    statusCode: HttpStatus.BAD_REQUEST
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Authentication token has expired',
    statusCode: HttpStatus.UNAUTHORIZED
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Invalid authentication token',
    statusCode: HttpStatus.UNAUTHORIZED
  },
  TOKEN_MISSING: {
    code: 'TOKEN_MISSING',
    message: 'Authentication token is required',
    statusCode: HttpStatus.UNAUTHORIZED
  },
  REFRESH_TOKEN_SUCCESS: {
    code: 'REFRESH_TOKEN_SUCCESS',
    message: 'Token refreshed successfully',
    statusCode: HttpStatus.OK
  },
  REFRESH_TOKEN_INVALID: {
    code: 'REFRESH_TOKEN_INVALID',
    message: 'Invalid refresh token',
    statusCode: HttpStatus.UNAUTHORIZED
  },
  REFRESH_TOKEN_EXPIRED: {
    code: 'REFRESH_TOKEN_EXPIRED',
    message: 'Refresh token has expired',
    statusCode: HttpStatus.UNAUTHORIZED
  }
};
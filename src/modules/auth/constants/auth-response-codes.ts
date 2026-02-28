import { BaseResponseCodes } from '../../../shared/constants/response-codes';

export const AuthResponseCodes = {
  ...BaseResponseCodes,
  
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User details not available'
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid username or password'
  },
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists'
  },
  REGISTRATION_SUCCESS: {
    code: 'REGISTRATION_SUCCESS',
    message: 'User registered successfully'
  },
  LOGIN_SUCCESS: {
    code: 'LOGIN_SUCCESS',
    message: 'Login successful'
  },
  ADMIN_ROLE_NOT_FOUND: {
    code: 'ADMIN_ROLE_NOT_FOUND',
    message: 'Admin role not found in database'
  },
  ADMIN_ALREADY_EXISTS: {
    code: 'ADMIN_ALREADY_EXISTS',
    message: 'Admin user already exists, registration closed'
  },
  ADMIN_REGISTRATION_CLOSED: {
    code: 'ADMIN_REGISTRATION_CLOSED',
    message: 'Admin registration is closed, use user creation API'
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Authentication token has expired'
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Invalid authentication token'
  },
  TOKEN_MISSING: {
    code: 'TOKEN_MISSING',
    message: 'Authentication token is required'
  }
};
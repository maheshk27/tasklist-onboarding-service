import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const UserResponseCodes = {
  ...BaseResponseCodes,
  
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  USER_CREATED: {
    code: 'USER_CREATED',
    message: 'User created successfully',
    statusCode: HttpStatus.CREATED
  },
  USER_UPDATED: {
    code: 'USER_UPDATED',
    message: 'User updated successfully',
    statusCode: HttpStatus.OK
  },
  USER_DELETED: {
    code: 'USER_DELETED',
    message: 'User deleted successfully',
    statusCode: HttpStatus.OK
  },
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists',
    statusCode: HttpStatus.CONFLICT
  },
  USERS_RETRIEVED: {
    code: 'USERS_RETRIEVED',
    message: 'Users retrieved successfully',
    statusCode: HttpStatus.OK
  },
  USER_RETRIEVED: {
    code: 'USER_RETRIEVED',
    message: 'User retrieved successfully',
    statusCode: HttpStatus.OK
  },
  USER_ROLE_NOT_FOUND: {
    code: 'USER_ROLE_NOT_FOUND',
    message: 'User role not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  ROLE_NOT_FOUND: {
    code: 'ROLE_NOT_FOUND',
    message: 'Role not found in database',
    statusCode: HttpStatus.NOT_FOUND
  },
  USER_ACTIVATED: {
    code: 'USER_ACTIVATED',
    message: 'User activated successfully',
    statusCode: HttpStatus.OK
  },
  USER_DEACTIVATED: {
    code: 'USER_DEACTIVATED',
    message: 'User deactivated successfully',
    statusCode: HttpStatus.OK
  },
  USER_ALREADY_ACTIVE: {
    code: 'USER_ALREADY_ACTIVE',
    message: 'User is already active',
    statusCode: HttpStatus.BAD_REQUEST
  },
  USER_ALREADY_INACTIVE: {
    code: 'USER_ALREADY_INACTIVE',
    message: 'User is already inactive',
    statusCode: HttpStatus.BAD_REQUEST
  },
  PASSWORD_MISMATCH: {
    code: 'PASSWORD_MISMATCH',
    message: 'New password and confirm password do not match',
    statusCode: HttpStatus.BAD_REQUEST
  },
  PASSWORD_TOO_SHORT: {
    code: 'PASSWORD_TOO_SHORT',
    message: 'Password must be at least 6 characters long',
    statusCode: HttpStatus.BAD_REQUEST
  },
  INVALID_CURRENT_PASSWORD: {
    code: 'INVALID_CURRENT_PASSWORD',
    message: 'Current password is incorrect',
    statusCode: HttpStatus.BAD_REQUEST
  },
  PASSWORD_RESET_SUCCESS: {
    code: 'PASSWORD_RESET_SUCCESS',
    message: 'Password reset successfully',
    statusCode: HttpStatus.OK
  },
  PASSWORD_CHANGE_SUCCESS: {
    code: 'PASSWORD_CHANGE_SUCCESS',
    message: 'Password changed successfully',
    statusCode: HttpStatus.OK
  },
  LOGIN_LOGS_RETRIEVED: {
    code: 'LOGIN_LOGS_RETRIEVED',
    message: 'Login logs retrieved successfully',
    statusCode: HttpStatus.OK
  },
  NON_LOGIN_USERS_RETRIEVED: {
    code: 'NON_LOGIN_USERS_RETRIEVED',
    message: 'Users who have not logged in retrieved successfully',
    statusCode: HttpStatus.OK
  }
};

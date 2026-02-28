import { BaseResponseCodes } from '../../../shared/constants/response-codes';

export const UserResponseCodes = {
  ...BaseResponseCodes,
  
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User details not available'
  },
  USER_CREATED: {
    code: 'USER_CREATED',
    message: 'User created successfully'
  },
  USER_UPDATED: {
    code: 'USER_UPDATED',
    message: 'User updated successfully'
  },
  USER_DELETED: {
    code: 'USER_DELETED',
    message: 'User deleted successfully'
  },
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists'
  },
  USERS_RETRIEVED: {
    code: 'USERS_RETRIEVED',
    message: 'Users retrieved successfully'
  },
  USER_RETRIEVED: {
    code: 'USER_RETRIEVED',
    message: 'User retrieved successfully'
  },
  USER_ROLE_NOT_FOUND: {
    code: 'USER_ROLE_NOT_FOUND',
    message: 'User role not found'
  },
  ROLE_NOT_FOUND: {
    code: 'ROLE_NOT_FOUND',
    message: 'Role not found in database'
  },
  USER_ACTIVATED: {
    code: 'USER_ACTIVATED',
    message: 'User activated successfully'
  },
  USER_DEACTIVATED: {
    code: 'USER_DEACTIVATED',
    message: 'User deactivated successfully'
  },
  USER_ALREADY_ACTIVE: {
    code: 'USER_ALREADY_ACTIVE',
    message: 'User is already active'
  },
  USER_ALREADY_INACTIVE: {
    code: 'USER_ALREADY_INACTIVE',
    message: 'User is already inactive'
  },
  PASSWORD_MISMATCH: {
    code: 'PASSWORD_MISMATCH',
    message: 'New password and confirm password do not match'
  },
  PASSWORD_TOO_SHORT: {
    code: 'PASSWORD_TOO_SHORT',
    message: 'Password must be at least 6 characters long'
  },
  INVALID_CURRENT_PASSWORD: {
    code: 'INVALID_CURRENT_PASSWORD',
    message: 'Current password is incorrect'
  },
  PASSWORD_RESET_SUCCESS: {
    code: 'PASSWORD_RESET_SUCCESS',
    message: 'Password reset successfully'
  },
  PASSWORD_CHANGE_SUCCESS: {
    code: 'PASSWORD_CHANGE_SUCCESS',
    message: 'Password changed successfully'
  }
};

import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const RolePermissionResponseCodes = {
  ...BaseResponseCodes,

  ROLE_PERMISSIONS_RETRIEVED: {
    code: 'ROLE_PERMISSIONS_RETRIEVED',
    message: 'Role permissions retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_PERMISSION_MATRIX_RETRIEVED: {
    code: 'ROLE_PERMISSION_MATRIX_RETRIEVED',
    message: 'Role permission matrix retrieved successfully',
    statusCode: HttpStatus.OK
  },
  MY_PERMISSIONS_RETRIEVED: {
    code: 'MY_PERMISSIONS_RETRIEVED',
    message: 'Current user permissions retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_PERMISSIONS_UPDATED: {
    code: 'ROLE_PERMISSIONS_UPDATED',
    message: 'Role permissions updated successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_PERMISSION_DELETED: {
    code: 'ROLE_PERMISSION_DELETED',
    message: 'Permission unassigned from role successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_PERMISSION_NOT_FOUND: {
    code: 'ROLE_PERMISSION_NOT_FOUND',
    message: 'Role permission mapping not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  ROLE_PERMISSION_ALREADY_EXISTS: {
    code: 'ROLE_PERMISSION_ALREADY_EXISTS',
    message: 'Permission is already assigned to this role',
    statusCode: HttpStatus.CONFLICT
  },
  ROLE_PERMISSION_INVALID_IDS: {
    code: 'ROLE_PERMISSION_INVALID_IDS',
    message: 'One or more permission IDs are invalid or do not exist',
    statusCode: HttpStatus.BAD_REQUEST
  },
  ROLE_PERMISSION_ROLE_NOT_FOUND: {
    code: 'ROLE_PERMISSION_ROLE_NOT_FOUND',
    message: 'Role associated with the current user was not found',
    statusCode: HttpStatus.NOT_FOUND
  }
};

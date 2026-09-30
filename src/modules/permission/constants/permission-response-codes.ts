import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const PermissionResponseCodes = {
  ...BaseResponseCodes,

  PERMISSION_NOT_FOUND: {
    code: 'PERMISSION_NOT_FOUND',
    message: 'Permission details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  PERMISSION_CREATED: {
    code: 'PERMISSION_CREATED',
    message: 'Permission created successfully',
    statusCode: HttpStatus.CREATED
  },
  PERMISSION_UPDATED: {
    code: 'PERMISSION_UPDATED',
    message: 'Permission updated successfully',
    statusCode: HttpStatus.OK
  },
  PERMISSION_DELETED: {
    code: 'PERMISSION_DELETED',
    message: 'Permission deleted successfully',
    statusCode: HttpStatus.OK
  },
  PERMISSIONS_RETRIEVED: {
    code: 'PERMISSIONS_RETRIEVED',
    message: 'Permissions retrieved successfully',
    statusCode: HttpStatus.OK
  },
  PERMISSION_RETRIEVED: {
    code: 'PERMISSION_RETRIEVED',
    message: 'Permission retrieved successfully',
    statusCode: HttpStatus.OK
  },
  PERMISSION_CODE_EXISTS: {
    code: 'PERMISSION_CODE_EXISTS',
    message: 'Permission code already exists',
    statusCode: HttpStatus.CONFLICT
  },
  PERMISSION_INVALID_ACTION_TYPE: {
    code: 'PERMISSION_INVALID_ACTION_TYPE',
    message: 'Invalid action type. Allowed values are VIEW, CREATE, UPDATE or DELETE',
    statusCode: HttpStatus.BAD_REQUEST
  },
  PERMISSION_IN_USE: {
    code: 'PERMISSION_IN_USE',
    message: 'Permission cannot be deleted while it is mapped to one or more roles',
    statusCode: HttpStatus.BAD_REQUEST
  }
};

import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const RoleResponseCodes = {
  ...BaseResponseCodes,
  
  ROLE_NOT_FOUND: {
    code: 'ROLE_NOT_FOUND',
    message: 'Role details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  ROLE_CREATED: {
    code: 'ROLE_CREATED',
    message: 'Role created successfully',
    statusCode: HttpStatus.CREATED
  },
  ROLE_UPDATED: {
    code: 'ROLE_UPDATED',
    message: 'Role updated successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_DELETED: {
    code: 'ROLE_DELETED',
    message: 'Role deleted successfully',
    statusCode: HttpStatus.OK
  },
  ROLES_RETRIEVED: {
    code: 'ROLES_RETRIEVED',
    message: 'Roles retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_RETRIEVED: {
    code: 'ROLE_RETRIEVED',
    message: 'Role retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_NAME_EXISTS: {
    code: 'ROLE_NAME_EXISTS',
    message: 'Role name already exists',
    statusCode: HttpStatus.CONFLICT
  },
  ROLE_NAME_TOO_SHORT: {
    code: 'ROLE_NAME_TOO_SHORT',
    message: 'Role name must be at least 2 characters long',
    statusCode: HttpStatus.BAD_REQUEST
  },
  ROLE_NAME_TOO_LONG: {
    code: 'ROLE_NAME_TOO_LONG',
    message: 'Role name cannot exceed 50 characters',
    statusCode: HttpStatus.BAD_REQUEST
  }
};

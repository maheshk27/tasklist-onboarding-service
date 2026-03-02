import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const UserStoreResponseCodes = {
  ...BaseResponseCodes,
  
  USER_STORE_NOT_FOUND: {
    code: 'USER_STORE_NOT_FOUND',
    message: 'User store mapping not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  USER_STORE_CREATED: {
    code: 'USER_STORE_CREATED',
    message: 'User store mapping created successfully',
    statusCode: HttpStatus.CREATED
  },
  USER_STORE_UPDATED: {
    code: 'USER_STORE_UPDATED',
    message: 'User store mapping updated successfully',
    statusCode: HttpStatus.OK
  },
  USER_STORES_RETRIEVED: {
    code: 'USER_STORES_RETRIEVED',
    message: 'User store mappings retrieved successfully',
    statusCode: HttpStatus.OK
  },
  USER_STORE_RETRIEVED: {
    code: 'USER_STORE_RETRIEVED',
    message: 'User store mapping retrieved successfully',
    statusCode: HttpStatus.OK
  },
  BULK_OPERATION_COMPLETED: {
    code: 'BULK_OPERATION_COMPLETED',
    message: 'Bulk operation completed successfully',
    statusCode: HttpStatus.OK
  },
  BULK_OPERATION_PARTIAL: {
    code: 'BULK_OPERATION_PARTIAL',
    message: 'Bulk operation completed with some failures',
    statusCode: HttpStatus.OK
  },
  STORE_USERS_RETRIEVED: {
    code: 'STORE_USERS_RETRIEVED',
    message: 'Store user mappings retrieved successfully',
    statusCode: HttpStatus.OK
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  STORE_NOT_FOUND: {
    code: 'STORE_NOT_FOUND',
    message: 'Store not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  USER_ALREADY_ACTIVE: {
    code: 'USER_ALREADY_ACTIVE',
    message: 'User is already active in this store',
    statusCode: HttpStatus.OK
  },
  USER_ALREADY_INACTIVE: {
    code: 'USER_ALREADY_INACTIVE',
    message: 'User is already inactive in this store',
    statusCode: HttpStatus.OK
  },
  USER_STORE_MAPPING_EXISTS: {
    code: 'USER_STORE_MAPPING_EXISTS',
    message: 'User store mapping already exists',
    statusCode: HttpStatus.CONFLICT
  },
  INVALID_USER_IDS: {
    code: 'INVALID_USER_IDS',
    message: 'Some user IDs are invalid or users do not exist',
    statusCode: HttpStatus.BAD_REQUEST
  },
  INVALID_STORE_ID: {
    code: 'INVALID_STORE_ID',
    message: 'Store ID is invalid or store does not exist',
    statusCode: HttpStatus.BAD_REQUEST
  }
};
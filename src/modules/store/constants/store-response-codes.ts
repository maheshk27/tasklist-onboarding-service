import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const StoreResponseCodes = {
  ...BaseResponseCodes,
  
  STORE_NOT_FOUND: {
    code: 'STORE_NOT_FOUND',
    message: 'Store details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  STORE_CREATED: {
    code: 'STORE_CREATED',
    message: 'Store created successfully',
    statusCode: HttpStatus.CREATED
  },
  STORE_UPDATED: {
    code: 'STORE_UPDATED',
    message: 'Store updated successfully',
    statusCode: HttpStatus.OK
  },
  STORES_RETRIEVED: {
    code: 'STORES_RETRIEVED',
    message: 'Stores retrieved successfully',
    statusCode: HttpStatus.OK
  },
  STORE_RETRIEVED: {
    code: 'STORE_RETRIEVED',
    message: 'Store retrieved successfully',
    statusCode: HttpStatus.OK
  },
  STORE_CODE_EXISTS: {
    code: 'STORE_CODE_EXISTS',
    message: 'Store code already exists',
    statusCode: HttpStatus.CONFLICT
  },
  STORE_NAME_TOO_SHORT: {
    code: 'STORE_NAME_TOO_SHORT',
    message: 'Store name must be at least 2 characters long',
    statusCode: HttpStatus.BAD_REQUEST
  },
  STORE_NAME_TOO_LONG: {
    code: 'STORE_NAME_TOO_LONG',
    message: 'Store name cannot exceed 100 characters',
    statusCode: HttpStatus.BAD_REQUEST
  },
  STORE_CODE_TOO_SHORT: {
    code: 'STORE_CODE_TOO_SHORT',
    message: 'Store code must be at least 2 characters long',
    statusCode: HttpStatus.BAD_REQUEST
  },
  STORE_CODE_TOO_LONG: {
    code: 'STORE_CODE_TOO_LONG',
    message: 'Store code cannot exceed 50 characters',
    statusCode: HttpStatus.BAD_REQUEST
  },
  ADDRESS_TOO_SHORT: {
    code: 'ADDRESS_TOO_SHORT',
    message: 'Address must be at least 5 characters long',
    statusCode: HttpStatus.BAD_REQUEST
  },
  ADDRESS_TOO_LONG: {
    code: 'ADDRESS_TOO_LONG',
    message: 'Address cannot exceed 200 characters',
    statusCode: HttpStatus.BAD_REQUEST
  },
  PIN_CODE_INVALID: {
    code: 'PIN_CODE_INVALID',
    message: 'Pin code must be between 4 and 10 characters',
    statusCode: HttpStatus.BAD_REQUEST
  }
};
import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const DepartmentResponseCodes = {
  ...BaseResponseCodes,
  
  DEPARTMENT_NOT_FOUND: {
    code: 'DEPARTMENT_NOT_FOUND',
    message: 'Department details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  DEPARTMENT_CREATED: {
    code: 'DEPARTMENT_CREATED',
    message: 'Department created successfully',
    statusCode: HttpStatus.CREATED
  },
  DEPARTMENT_UPDATED: {
    code: 'DEPARTMENT_UPDATED',
    message: 'Department updated successfully',
    statusCode: HttpStatus.OK
  },
  DEPARTMENT_DELETED: {
    code: 'DEPARTMENT_DELETED',
    message: 'Department deleted successfully',
    statusCode: HttpStatus.OK
  },
  DEPARTMENTS_RETRIEVED: {
    code: 'DEPARTMENTS_RETRIEVED',
    message: 'Departments retrieved successfully',
    statusCode: HttpStatus.OK
  },
  DEPARTMENT_RETRIEVED: {
    code: 'DEPARTMENT_RETRIEVED',
    message: 'Department retrieved successfully',
    statusCode: HttpStatus.OK
  },
  DEPARTMENT_NAME_EXISTS: {
    code: 'DEPARTMENT_NAME_EXISTS',
    message: 'Department name already exists',
    statusCode: HttpStatus.CONFLICT
  },
  DEPARTMENT_NAME_TOO_SHORT: {
    code: 'DEPARTMENT_NAME_TOO_SHORT',
    message: 'Department name must be at least 2 characters long',
    statusCode: HttpStatus.BAD_REQUEST
  },
  DEPARTMENT_NAME_TOO_LONG: {
    code: 'DEPARTMENT_NAME_TOO_LONG',
    message: 'Department name cannot exceed 100 characters',
    statusCode: HttpStatus.BAD_REQUEST
  }
};
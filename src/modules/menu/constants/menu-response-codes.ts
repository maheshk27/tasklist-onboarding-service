import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const MenuResponseCodes = {
  ...BaseResponseCodes,

  MENU_NOT_FOUND: {
    code: 'MENU_NOT_FOUND',
    message: 'Menu details not available',
    statusCode: HttpStatus.NOT_FOUND
  },
  MENU_CREATED: {
    code: 'MENU_CREATED',
    message: 'Menu created successfully',
    statusCode: HttpStatus.CREATED
  },
  MENU_UPDATED: {
    code: 'MENU_UPDATED',
    message: 'Menu updated successfully',
    statusCode: HttpStatus.OK
  },
  MENU_DELETED: {
    code: 'MENU_DELETED',
    message: 'Menu deleted successfully',
    statusCode: HttpStatus.OK
  },
  MENUS_RETRIEVED: {
    code: 'MENUS_RETRIEVED',
    message: 'Menus retrieved successfully',
    statusCode: HttpStatus.OK
  },
  MENU_RETRIEVED: {
    code: 'MENU_RETRIEVED',
    message: 'Menu retrieved successfully',
    statusCode: HttpStatus.OK
  },
  MENU_TREE_RETRIEVED: {
    code: 'MENU_TREE_RETRIEVED',
    message: 'Menu tree retrieved successfully',
    statusCode: HttpStatus.OK
  },
  MENU_CODE_EXISTS: {
    code: 'MENU_CODE_EXISTS',
    message: 'Menu code already exists',
    statusCode: HttpStatus.CONFLICT
  },
  MENU_PARENT_NOT_FOUND: {
    code: 'MENU_PARENT_NOT_FOUND',
    message: 'Parent menu not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  MENU_INVALID_PORTAL: {
    code: 'MENU_INVALID_PORTAL',
    message: 'Invalid portal. Allowed values are ADMIN, STAFF or BOTH',
    statusCode: HttpStatus.BAD_REQUEST
  },
  MENU_SELF_PARENT: {
    code: 'MENU_SELF_PARENT',
    message: 'A menu cannot be its own parent',
    statusCode: HttpStatus.BAD_REQUEST
  },
  MENU_PARENT_CYCLE: {
    code: 'MENU_PARENT_CYCLE',
    message: 'Setting this parent would create a circular menu hierarchy',
    statusCode: HttpStatus.BAD_REQUEST
  },
  MENU_HAS_CHILDREN: {
    code: 'MENU_HAS_CHILDREN',
    message: 'Menu cannot be deleted while it has child menus',
    statusCode: HttpStatus.BAD_REQUEST
  },
  MENU_IN_USE: {
    code: 'MENU_IN_USE',
    message: 'Menu cannot be deleted while it is mapped to one or more roles',
    statusCode: HttpStatus.BAD_REQUEST
  }
};

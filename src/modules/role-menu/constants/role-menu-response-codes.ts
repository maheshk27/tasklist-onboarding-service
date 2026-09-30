import { BaseResponseCodes } from '../../../shared/constants/response-codes';
import { HttpStatus } from '@nestjs/common';

export const RoleMenuResponseCodes = {
  ...BaseResponseCodes,

  ROLE_MENUS_RETRIEVED: {
    code: 'ROLE_MENUS_RETRIEVED',
    message: 'Role menu mappings retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_MENUS_ASSIGNED: {
    code: 'ROLE_MENUS_ASSIGNED',
    message: 'Menus assigned to role successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_MENU_CREATED: {
    code: 'ROLE_MENU_CREATED',
    message: 'Menu assigned to role successfully',
    statusCode: HttpStatus.CREATED
  },
  ROLE_MENU_DELETED: {
    code: 'ROLE_MENU_DELETED',
    message: 'Menu unassigned from role successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_MENU_NOT_FOUND: {
    code: 'ROLE_MENU_NOT_FOUND',
    message: 'Role menu mapping not found',
    statusCode: HttpStatus.NOT_FOUND
  },
  ROLE_MENU_ALREADY_EXISTS: {
    code: 'ROLE_MENU_ALREADY_EXISTS',
    message: 'Menu is already assigned to this role',
    statusCode: HttpStatus.CONFLICT
  },
  ROLE_MENUS_MENU_RETRIEVED: {
    code: 'ROLE_MENUS_MENU_RETRIEVED',
    message: 'Menus for role retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_MENUS_ROLES_RETRIEVED: {
    code: 'ROLE_MENUS_ROLES_RETRIEVED',
    message: 'Roles mapped to menu retrieved successfully',
    statusCode: HttpStatus.OK
  },
  ROLE_MENU_INVALID_MENU_IDS: {
    code: 'ROLE_MENU_INVALID_MENU_IDS',
    message: 'One or more menu IDs are invalid or do not exist',
    statusCode: HttpStatus.BAD_REQUEST
  }
};

import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionActionEnum } from '../../../shared/enums/permission-action.enum';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    description: 'Complete list of permission IDs to grant to the role. Existing grants not in this list are revoked.',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}

export class RolePermissionResponseDto {
  @ApiProperty({ example: 1 })
  rolePermissionId: number;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 5 })
  permissionId: number;

  @ApiPropertyOptional({ example: 'ADMIN_ROLE_MANAGEMENT_VIEW', required: false })
  permissionCode?: string;

  @ApiPropertyOptional({ example: 'Role Management - View', required: false })
  permissionName?: string;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class PermissionMatrixItemDto {
  @ApiProperty({ example: 5 })
  permissionId: number;

  @ApiProperty({ example: 'ADMIN_ROLE_MANAGEMENT_VIEW' })
  permissionCode: string;

  @ApiProperty({ example: 'Role Management - View' })
  permissionName: string;

  @ApiProperty({ example: 'ADMIN_ROLE_MANAGEMENT', nullable: true })
  moduleCode?: string | null;

  @ApiProperty({ example: 'VIEW', enum: PermissionActionEnum })
  actionType: PermissionActionEnum;

  @ApiProperty({ description: 'Whether this permission is granted to the role', example: true })
  enabled: boolean;
}

export class RolePermissionMatrixDto {
  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 'Manager' })
  roleName: string;

  @ApiProperty({ type: [PermissionMatrixItemDto] })
  permissions: PermissionMatrixItemDto[];
}

export class RolePermissionBulkResultDto {
  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: [1, 2, 3], type: [Number] })
  permissionIds: number[];

  @ApiProperty({ example: 3 })
  assigned: number;

  @ApiProperty({ example: 1 })
  removed: number;
}

export class MyPermissionsDto {
  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 'Manager' })
  roleName: string;

  @ApiProperty({
    description: 'Flat list of granted permission codes for the current user role',
    example: ['ADMIN_ROLE_MANAGEMENT_VIEW', 'ADMIN_ROLE_MANAGEMENT_CREATE'],
    type: [String],
  })
  permissions: string[];
}

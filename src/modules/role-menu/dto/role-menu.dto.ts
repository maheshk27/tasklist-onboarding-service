import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRoleMenuDto {
  @ApiProperty({ description: 'Role ID to assign the menu to', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ description: 'Menu ID to assign', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  menuId: number;
}

export class BulkRoleMenuDto {
  @ApiProperty({
    description: 'Complete list of menu IDs to assign to the role. Existing mappings not in this list are removed.',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  menuIds: number[];
}

export class RoleMenuResponseDto {
  @ApiProperty({ example: 1 })
  roleMenuId: number;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 5 })
  menuId: number;

  @ApiPropertyOptional({ description: 'Role name when the role relation is loaded', example: 'Manager', required: false })
  roleName?: string;

  @ApiPropertyOptional({ description: 'Menu name when the menu relation is loaded', example: 'Role Management', required: false })
  menuName?: string;

  @ApiPropertyOptional({ description: 'Menu code when the menu relation is loaded', example: 'ADMIN_ROLE_MANAGEMENT', required: false })
  menuCode?: string;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class RoleMenuBulkResultDto {
  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: [1, 2, 3], type: [Number] })
  menuIds: number[];

  @ApiProperty({ example: 3 })
  assigned: number;

  @ApiProperty({ example: 1 })
  removed: number;
}

export class MenuRoleResponseDto {
  @ApiProperty({ example: 5 })
  menuId: number;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 'Manager' })
  roleName: string;
}

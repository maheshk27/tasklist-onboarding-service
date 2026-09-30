import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionActionEnum } from '../../../shared/enums/permission-action.enum';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Unique permission code, typically <MODULE_CODE>_<ACTION>',
    example: 'ADMIN_ROLE_MANAGEMENT_VIEW',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  permissionCode: string;

  @ApiProperty({ description: 'Human readable permission name', example: 'Role Management - View', maxLength: 200 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  permissionName: string;

  @ApiPropertyOptional({
    description: 'Module/menu code this permission belongs to',
    example: 'ADMIN_ROLE_MANAGEMENT',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  moduleCode?: string | null;

  @ApiProperty({ description: 'Action the permission grants', example: 'VIEW', enum: PermissionActionEnum })
  @IsNotEmpty()
  @IsString()
  actionType: PermissionActionEnum;

  @ApiPropertyOptional({ description: 'Optional description', example: 'Allows viewing the role management screen', required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ description: 'Display order', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Whether the permission is active', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePermissionDto {
  @ApiPropertyOptional({ description: 'Updated unique permission code', example: 'ADMIN_ROLE_MANAGEMENT_VIEW', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  permissionCode?: string;

  @ApiPropertyOptional({ description: 'Updated permission name', example: 'Role Management - View', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  permissionName?: string;

  @ApiPropertyOptional({ description: 'Updated module/menu code', example: 'ADMIN_ROLE_MANAGEMENT', required: false, nullable: true })
  @IsOptional()
  @IsString()
  moduleCode?: string | null;

  @ApiPropertyOptional({ description: 'Updated action type', example: 'UPDATE', enum: PermissionActionEnum, required: false })
  @IsOptional()
  @IsString()
  actionType?: PermissionActionEnum;

  @ApiPropertyOptional({ description: 'Updated description', example: 'Allows viewing the role management screen', required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ description: 'Updated display order', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Updated active flag', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PermissionResponseDto {
  @ApiProperty({ example: 1 })
  permissionId: number;

  @ApiProperty({ example: 'ADMIN_ROLE_MANAGEMENT_VIEW' })
  permissionCode: string;

  @ApiProperty({ example: 'Role Management - View' })
  permissionName: string;

  @ApiProperty({ example: 'ADMIN_ROLE_MANAGEMENT', nullable: true })
  moduleCode?: string | null;

  @ApiProperty({ example: 'VIEW', enum: PermissionActionEnum })
  actionType: PermissionActionEnum;

  @ApiProperty({ example: 'Allows viewing the role management screen', nullable: true })
  description?: string | null;

  @ApiProperty({ example: 10 })
  sequence: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}

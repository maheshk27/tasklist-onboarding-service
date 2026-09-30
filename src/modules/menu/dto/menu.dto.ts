import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiPropertyOptional({
    description: 'Parent menu ID. Leave empty for a top-level menu',
    example: 2,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number | null;

  @ApiProperty({
    description: 'Unique stable code for the menu (used by the permission catalog)',
    example: 'ADMIN_ROLE_MANAGEMENT',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  menuCode: string;

  @ApiProperty({
    description: 'Display name of the menu',
    example: 'Role Management',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  menuName: string;

  @ApiPropertyOptional({
    description: 'Lucide icon name rendered by the portals',
    example: 'Shield',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  icon?: string | null;

  @ApiPropertyOptional({
    description: 'Frontend route path. Leave empty for a group/parent menu',
    example: '/roles',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  routePath?: string | null;

  @ApiProperty({
    description: 'Portal this menu belongs to',
    example: 'ADMIN',
    enum: ['ADMIN', 'STAFF', 'BOTH'],
  })
  @IsNotEmpty()
  @IsString()
  portal: string;

  @ApiPropertyOptional({
    description: 'Display order within its parent',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiPropertyOptional({
    description: 'Whether the menu is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMenuDto {
  @ApiPropertyOptional({
    description: 'Updated parent menu ID. Send null to make it a top-level menu',
    example: 2,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number | null;

  @ApiPropertyOptional({ description: 'Updated unique menu code', example: 'ADMIN_ROLE_MANAGEMENT', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  menuCode?: string;

  @ApiPropertyOptional({ description: 'Updated display name', example: 'Role Management', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  menuName?: string;

  @ApiPropertyOptional({ description: 'Updated Lucide icon name', example: 'Shield', required: false, nullable: true })
  @IsOptional()
  @IsString()
  icon?: string | null;

  @ApiPropertyOptional({ description: 'Updated route path (null for a group menu)', example: '/roles', required: false, nullable: true })
  @IsOptional()
  @IsString()
  routePath?: string | null;

  @ApiPropertyOptional({ description: 'Updated portal', example: 'ADMIN', enum: ['ADMIN', 'STAFF', 'BOTH'], required: false })
  @IsOptional()
  @IsString()
  portal?: string;

  @ApiPropertyOptional({ description: 'Updated display order', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Updated active flag', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class MenuResponseDto {
  @ApiProperty({ example: 1 })
  menuId: number;

  @ApiProperty({ example: 2, nullable: true })
  parentId?: number | null;

  @ApiProperty({ example: 'ADMIN_ROLE_MANAGEMENT' })
  menuCode: string;

  @ApiProperty({ example: 'Role Management' })
  menuName: string;

  @ApiProperty({ example: 'Shield', nullable: true })
  icon?: string | null;

  @ApiProperty({ example: '/roles', nullable: true })
  routePath?: string | null;

  @ApiProperty({ example: 'ADMIN' })
  portal: string;

  @ApiProperty({ example: 1 })
  sequence: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class MenuTreeNodeDto extends MenuResponseDto {
  @ApiProperty({ type: () => [MenuTreeNodeDto] })
  children: MenuTreeNodeDto[];
}

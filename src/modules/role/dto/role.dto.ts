import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Unique name for the role',
    example: 'Admin',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  roleName: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Updated role name (must be unique)',
    example: 'Administrator',
    required: false,
  })
  @IsOptional()
  @IsString()
  roleName?: string;
}

export class RoleResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the role',
    example: 1,
  })
  roleId: number;

  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  roleName: string;

  @ApiProperty({
    description: 'Date and time when the role record was created',
    example: '2023-07-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the role record was last updated',
    example: '2023-07-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
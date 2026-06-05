import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the user account',
    example: 'jane_smith',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePass123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Jane',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User middle name (optional)',
    example: 'Marie',
    required: false,
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Smith',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User email address (optional)',
    example: 'jane.smith@example.com',
    required: false,
  })
  @IsEmail()
  emailId?: string;

  @ApiProperty({
    description: 'User mobile number (optional)',
    example: '+1987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiProperty({
    description: 'Role ID for the user',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({
    description: 'Whether the user account is active (optional)',
    example: true,
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Department ID for the user (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  departmentId?: number;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Updated first name (optional)',
    example: 'Jane',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Updated middle name (optional)',
    example: 'Marie',
    required: false,
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'Updated last name (optional)',
    example: 'Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Updated email address (optional)',
    example: 'jane.smith@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  emailId?: string;

  @ApiProperty({
    description: 'Updated mobile number (optional)',
    example: '+1987654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({
    description: 'Updated role name (optional)',
    example: 'Admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  roleName?: string;

  @ApiProperty({
    description: 'Updated role ID (optional)',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({
    description: 'Whether the user account is active (optional)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Department ID for the user (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  departmentId?: number;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Username of the user',
    example: 'jane_smith',
  })
  userName: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Jane',
  })
  firstName: string;

  @ApiProperty({
    description: 'Middle name of the user (if available)',
    example: 'Marie',
    required: false,
  })
  middleName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Smith',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'jane.smith@example.com',
    required: false,
  })
  emailId?: string;

  @ApiProperty({
    description: 'Mobile number of the user',
    example: '+1987654321',
    required: false,
  })
  mobile?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Role information for the user',
    type: 'object',
    properties: {
      roleId: {
        type: 'number',
        example: 2,
        description: 'Role ID assigned to the user'
      },
      roleName: {
        type: 'string',
        example: 'User',
        description: 'Role name assigned to the user'
      }
    }
  })
  role: {
    roleId: number;
    roleName: string;
  };

  @ApiProperty({
    description: 'Department ID of the user (optional)',
    example: 1,
    required: false,
  })
  departmentId?: number;

  @ApiProperty({
    description: 'Department information of the user (optional)',
    type: 'object',
    properties: {
      departmentId: {
        type: 'number',
        example: 1,
        description: 'Department ID'
      },
      departmentName: {
        type: 'string',
        example: 'Maintenance',
        description: 'Department name'
      }
    },
    required: false,
  })
  department?: {
    departmentId: number;
    departmentName: string;
  };

  @ApiProperty({
    description: 'Date and time when the user record was created',
    example: '2023-07-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the user record was last updated',
    example: '2023-07-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

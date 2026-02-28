import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

export class RegisterDto {
  @ApiProperty({
    description: 'Unique username for the user account',
    example: 'john_doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User middle name (optional)',
    example: 'Michael',
    required: false,
  })
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User email address (optional)',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  emailId?: string;

  @ApiProperty({
    description: 'User mobile number (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  mobile?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Password for authentication',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IkFkbWluIiwiaWF0IjoxNjI2MjMwNDAyfQ.sample_token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      userId: {
        type: 'number',
        example: 1,
        description: 'Unique identifier for the user',
      },
      userName: {
        type: 'string',
        example: 'john_doe',
        description: 'Username of the authenticated user',
      },
      firstName: {
        type: 'string',
        example: 'John',
        description: 'First name of the user',
      },
      lastName: {
        type: 'string',
        example: 'Doe',
        description: 'Last name of the user',
      },
      emailId: {
        type: 'string',
        example: 'john.doe@example.com',
        description: 'Email address of the user (optional)',
        nullable: true,
      },
      roleId: {
        type: 'number',
        example: 1,
        description: 'Uniqie identifier for Role',
        nullable: false
      },
      roleName: {
        type: 'string',
        example: 'Admin',
        description: 'Role assigned to the user',
      },
    },
  })
  user: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    emailId?: string;
    roleId: number;
    roleName: string;
  };
}

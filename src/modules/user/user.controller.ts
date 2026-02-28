import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { UserResponseCodes } from './constants/user-response-codes';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system. Requires authentication with a valid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved users list',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USERS_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Users retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              userId: { type: 'number', example: 1 },
              userName: { type: 'string', example: 'john_doe' },
              firstName: { type: 'string', example: 'John' },
              middleName: { type: 'string', example: 'Michael' },
              lastName: { type: 'string', example: 'Doe' },
              emailId: { type: 'string', example: 'john.doe@example.com' },
              mobile: { type: 'string', example: '+1234567890' },
              isActive: { type: 'boolean', example: true },
              roleId: { type: 'number', example: 1 },
              roleName: { type: 'string', example: 'Admin' },
              createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            },
          },
          example: [
            {
              userId: 1,
              userName: 'john_doe',
              firstName: 'John',
              middleName: 'Michael',
              lastName: 'Doe',
              emailId: 'john.doe@example.com',
              mobile: '+1234567890',
              isActive: true,
              roleId: 1,
              roleName: 'Admin',
              createdAt: '2023-07-15T10:30:00.000Z',
              updatedAt: '2023-07-15T10:30:00.000Z',
            },
            {
              userId: 2,
              userName: 'jane_smith',
              firstName: 'Jane',
              middleName: 'Marie',
              lastName: 'Smith',
              emailId: 'jane.smith@example.com',
              mobile: '+1987654321',
              isActive: true,
              roleId: 2,
              roleName: 'User',
              createdAt: '2023-07-15T10:30:00.000Z',
              updatedAt: '2023-07-15T10:30:00.000Z',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authentication required' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve users',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findAll(): Promise<StandardApiResponse<UserResponseDto[]>> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique ID. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'User retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'number', example: 1 },
            userName: { type: 'string', example: 'john_doe' },
            firstName: { type: 'string', example: 'John' },
            middleName: { type: 'string', example: 'Michael' },
            lastName: { type: 'string', example: 'Doe' },
            emailId: { type: 'string', example: 'john.doe@example.com' },
            mobile: { type: 'string', example: '+1234567890' },
            isActive: { type: 'boolean', example: true },
            roleId: { type: 'number', example: 1 },
            roleName: { type: 'string', example: 'Admin' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            userId: 1,
            userName: 'john_doe',
            firstName: 'John',
            middleName: 'Michael',
            lastName: 'Doe',
            emailId: 'john.doe@example.com',
            mobile: '+1234567890',
            isActive: true,
            roleId: 1,
            roleName: 'Admin',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T10:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'User details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authentication required' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to retrieve user',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<StandardApiResponse<UserResponseDto>> {
    return this.userService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user account with the provided information. Requires authentication with a valid JWT token.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
    examples: {
      example1: {
        summary: 'Create User Example',
        description: 'Example of user creation data',
        value: {
          userName: 'new_user',
          firstName: 'Alice',
          middleName: 'Wonder',
          lastName: 'Smith',
          emailId: 'alice.smith@example.com',
          mobile: '+1112223333',
          roleName: 'User',
          roleId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_CREATED',
        },
        message: {
          type: 'string',
          example: 'User created successfully',
        },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'number', example: 3 },
            userName: { type: 'string', example: 'new_user' },
            firstName: { type: 'string', example: 'Alice' },
            middleName: { type: 'string', example: 'Wonder' },
            lastName: { type: 'string', example: 'Smith' },
            emailId: { type: 'string', example: 'alice.smith@example.com' },
            mobile: { type: 'string', example: '+1112223333' },
            isActive: { type: 'boolean', example: true },
            roleId: { type: 'number', example: 2 },
            roleName: { type: 'string', example: 'User' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            userId: 3,
            userName: 'new_user',
            firstName: 'Alice',
            middleName: 'Wonder',
            lastName: 'Smith',
            emailId: 'alice.smith@example.com',
            mobile: '+1112223333',
            isActive: true,
            roleId: 2,
            roleName: 'User',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T10:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'VALIDATION_ERROR' },
        message: { type: 'string', example: 'Validation failed' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USERNAME_EXISTS' },
        message: { type: 'string', example: 'Username already exists' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authentication required' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to create user',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<StandardApiResponse<UserResponseDto>> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Updates an existing user account with the provided information. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
    examples: {
      example1: {
        summary: 'Update User Example',
        description: 'Example of user update data',
        value: {
          firstName: 'Johnathan',
          emailId: 'john.newemail@example.com',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_UPDATED',
        },
        message: {
          type: 'string',
          example: 'User updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'number', example: 1 },
            userName: { type: 'string', example: 'john_doe' },
            firstName: { type: 'string', example: 'Johnathan' },
            middleName: { type: 'string', example: 'Michael' },
            lastName: { type: 'string', example: 'Doe' },
            emailId: { type: 'string', example: 'john.newemail@example.com' },
            mobile: { type: 'string', example: '+1234567890' },
            isActive: { type: 'boolean', example: true },
            roleId: { type: 'number', example: 1 },
            roleName: { type: 'string', example: 'Admin' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T11:00:00.000Z' },
          },
          example: {
            userId: 1,
            userName: 'john_doe',
            firstName: 'Johnathan',
            middleName: 'Michael',
            lastName: 'Doe',
            emailId: 'john.newemail@example.com',
            mobile: '+1234567890',
            isActive: true,
            roleId: 1,
            roleName: 'Admin',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T11:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'User details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authentication required' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to update user',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<StandardApiResponse<UserResponseDto>> {
    return this.userService.update(+id, updateUserDto);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate user by ID',
    description: 'Activates a deactivated user account by setting isActive = true. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID to activate',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully activated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_ACTIVATED',
        },
        message: {
          type: 'string',
          example: 'User activated successfully',
        },
        data: {
          type: 'null',
          example: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'User details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already active',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_ALREADY_ACTIVE' },
        message: { type: 'string', example: 'User is already active' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authentication required' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to activate user',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async activateUser(@Param('id') id: string): Promise<StandardApiResponse<null>> {
    return this.userService.activateUser(+id);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate user by ID',
    description: 'Deactivates an active user account by setting isActive = false. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID to deactivate',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deactivated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_DEACTIVATED',
        },
        message: {
          type: 'string',
          example: 'User deactivated successfully',
        },
        data: {
          type: 'null',
          example: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'User details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already inactive',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_ALREADY_INACTIVE' },
        message: { type: 'string', example: 'User is already inactive' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authentication required' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to deactivate user',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async deactivateUser(@Param('id') id: string): Promise<StandardApiResponse<null>> {
    return this.userService.deactivateUser(+id);
  }
}

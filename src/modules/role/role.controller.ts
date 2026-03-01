import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  HttpCode, 
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from './dto/role.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { RolesGuard, JwtAuthGuard } from '../../shared/guards';
import { Roles } from '../../shared/decorators/roles.decorator';
import { DynamicResponse } from '../../shared/decorators/dynamic-response.decorator';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Retrieves a list of all roles in the system. Requires authentication with a valid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved roles list',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'ROLES_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Roles retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              roleId: { type: 'number', example: 1 },
              roleName: { type: 'string', example: 'Admin' },
              createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            },
          },
          example: [
            {
              roleId: 1,
              roleName: 'Admin',
              createdAt: '2023-07-15T10:30:00.000Z',
              updatedAt: '2023-07-15T10:30:00.000Z',
            },
            {
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
    description: 'Failed to retrieve roles',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findAll(): Promise<StandardApiResponse<RoleResponseDto[]>> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Retrieves a specific role by its unique ID. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Role ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved role',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'ROLE_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Role retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            roleId: { type: 'number', example: 1 },
            roleName: { type: 'string', example: 'Admin' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
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
    description: 'Role not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'ROLE_NOT_FOUND' },
        message: { type: 'string', example: 'Role details not available' },
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
    description: 'Failed to retrieve role',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<StandardApiResponse<RoleResponseDto>> {
    return this.roleService.findOne(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Creates a new role with the provided name. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role creation data',
    examples: {
      example1: {
        summary: 'Create Role Example',
        description: 'Example of role creation data',
        value: {
          roleName: 'Supervisor',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role successfully created',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'ROLE_CREATED',
        },
        message: {
          type: 'string',
          example: 'Role created successfully',
        },
        data: {
          type: 'object',
          properties: {
            roleId: { type: 'number', example: 3 },
            roleName: { type: 'string', example: 'Supervisor' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            roleId: 3,
            roleName: 'Supervisor',
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
    description: 'Role name already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'ROLE_NAME_EXISTS' },
        message: { type: 'string', example: 'Role name already exists' },
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
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'FORBIDDEN' },
        message: { type: 'string', example: 'Access denied. Required roles: Admin, Manager' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to create role',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<StandardApiResponse<RoleResponseDto>> {
    return this.roleService.create(createRoleDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Update role by ID',
    description: 'Updates an existing role with the provided information. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Role ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'Role update data',
    examples: {
      example1: {
        summary: 'Update Role Example',
        description: 'Example of role update data',
        value: {
          roleName: 'Administrator',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role successfully updated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'ROLE_UPDATED',
        },
        message: {
          type: 'string',
          example: 'Role updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            roleId: { type: 'number', example: 1 },
            roleName: { type: 'string', example: 'Administrator' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T11:00:00.000Z' },
          },
          example: {
            roleId: 1,
            roleName: 'Administrator',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T11:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'ROLE_NOT_FOUND' },
        message: { type: 'string', example: 'Role details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Role name already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'ROLE_NAME_EXISTS' },
        message: { type: 'string', example: 'Role name already exists' },
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
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'FORBIDDEN' },
        message: { type: 'string', example: 'Access denied. Required roles: Admin, Manager' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to update role',
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
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<StandardApiResponse<RoleResponseDto>> {
    return this.roleService.update(+id, updateRoleDto);
  }
}
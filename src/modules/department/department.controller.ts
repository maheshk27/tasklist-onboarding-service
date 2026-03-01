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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentResponseDto } from './dto/department.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { RolesGuard, JwtAuthGuard } from '../../shared/guards';
import { Roles } from '../../shared/decorators/roles.decorator';
import { DynamicResponse } from '../../shared/decorators/dynamic-response.decorator';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Departments')
@Controller('departments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all departments',
    description: 'Retrieves a list of all departments in the system. Requires authentication with a valid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved departments list',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'DEPARTMENTS_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Departments retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              departmentId: { type: 'number', example: 1 },
              departmentName: { type: 'string', example: 'Engineering' },
              createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            },
          },
          example: [
            {
              departmentId: 1,
              departmentName: 'Engineering',
              createdAt: '2023-07-15T10:30:00.000Z',
              updatedAt: '2023-07-15T10:30:00.000Z',
            },
            {
              departmentId: 2,
              departmentName: 'Marketing',
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
    description: 'Failed to retrieve departments',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findAll(): Promise<StandardApiResponse<DepartmentResponseDto[]>> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get department by ID',
    description: 'Retrieves a specific department by its unique ID. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Department ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved department',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'DEPARTMENT_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Department retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            departmentId: { type: 'number', example: 1 },
            departmentName: { type: 'string', example: 'Engineering' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            departmentId: 1,
            departmentName: 'Engineering',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T10:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Department not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'DEPARTMENT_NOT_FOUND' },
        message: { type: 'string', example: 'Department details not available' },
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
    description: 'Failed to retrieve department',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<StandardApiResponse<DepartmentResponseDto>> {
    return this.departmentService.findOne(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Create a new department',
    description: 'Creates a new department with the provided name. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiBody({
    type: CreateDepartmentDto,
    description: 'Department creation data',
    examples: {
      example1: {
        summary: 'Create Department Example',
        description: 'Example of department creation data',
        value: {
          departmentName: 'Human Resources',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Department successfully created',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'DEPARTMENT_CREATED',
        },
        message: {
          type: 'string',
          example: 'Department created successfully',
        },
        data: {
          type: 'object',
          properties: {
            departmentId: { type: 'number', example: 3 },
            departmentName: { type: 'string', example: 'Human Resources' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            departmentId: 3,
            departmentName: 'Human Resources',
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
    description: 'Department name already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'DEPARTMENT_NAME_EXISTS' },
        message: { type: 'string', example: 'Department name already exists' },
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
    description: 'Failed to create department',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<StandardApiResponse<DepartmentResponseDto>> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Update department by ID',
    description: 'Updates an existing department with the provided information. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Department ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateDepartmentDto,
    description: 'Department update data',
    examples: {
      example1: {
        summary: 'Update Department Example',
        description: 'Example of department update data',
        value: {
          departmentName: 'Engineering Department',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department successfully updated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'DEPARTMENT_UPDATED',
        },
        message: {
          type: 'string',
          example: 'Department updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            departmentId: { type: 'number', example: 1 },
            departmentName: { type: 'string', example: 'Engineering Department' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T11:00:00.000Z' },
          },
          example: {
            departmentId: 1,
            departmentName: 'Engineering Department',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T11:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Department not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'DEPARTMENT_NOT_FOUND' },
        message: { type: 'string', example: 'Department details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Department name already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'DEPARTMENT_NAME_EXISTS' },
        message: { type: 'string', example: 'Department name already exists' },
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
    description: 'Failed to update department',
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
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ): Promise<StandardApiResponse<DepartmentResponseDto>> {
    return this.departmentService.update(+id, updateDepartmentDto);
  }
}
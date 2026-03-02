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
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto } from './dto/store.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { RolesGuard, JwtAuthGuard } from '../../shared/guards';
import { Roles } from '../../shared/decorators/roles.decorator';
import { DynamicResponse } from '../../shared/decorators/dynamic-response.decorator';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Stores')
@Controller('stores')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all stores',
    description: 'Retrieves a list of all stores in the system. Requires authentication with a valid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved stores list',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'STORES_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Stores retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              storeId: { type: 'number', example: 1 },
              storeName: { type: 'string', example: 'Main Store' },
              storeCode: { type: 'string', example: 'STORE001' },
              storeImageUrl: { type: 'string', example: 'store-images/main-store.jpg', nullable: true },
              addressLine1: { type: 'string', example: '123 Main Street' },
              addressLine2: { type: 'string', example: 'Suite 100', nullable: true },
              country: { type: 'string', example: 'India' },
              state: { type: 'string', example: 'Maharashtra' },
              city: { type: 'string', example: 'Mumbai' },
              pinCode: { type: 'string', example: '400001' },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            },
          },
          example: [
            {
              storeId: 1,
              storeName: 'Main Store',
              storeCode: 'STORE001',
              storeImageUrl: 'store-images/main-store.jpg',
              addressLine1: '123 Main Street',
              addressLine2: 'Suite 100',
              country: 'India',
              state: 'Maharashtra',
              city: 'Mumbai',
              pinCode: '400001',
              isActive: true,
              createdAt: '2023-07-15T10:30:00.000Z',
              updatedAt: '2023-07-15T10:30:00.000Z',
            },
            {
              storeId: 2,
              storeName: 'Branch Store',
              storeCode: 'STORE002',
              storeImageUrl: null,
              addressLine1: '456 Branch Road',
              addressLine2: null,
              country: 'India',
              state: 'Maharashtra',
              city: 'Pune',
              pinCode: '411001',
              isActive: true,
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
    description: 'Failed to retrieve stores',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findAll(): Promise<StandardApiResponse<StoreResponseDto[]>> {
    return this.storeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get store by ID',
    description: 'Retrieves a specific store by its unique ID. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Store ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved store',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'STORE_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Store retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            storeId: { type: 'number', example: 1 },
            storeName: { type: 'string', example: 'Main Store' },
            storeCode: { type: 'string', example: 'STORE001' },
            storeImageUrl: { type: 'string', example: 'store-images/main-store.jpg', nullable: true },
            addressLine1: { type: 'string', example: '123 Main Street' },
            addressLine2: { type: 'string', example: 'Suite 100', nullable: true },
            country: { type: 'string', example: 'India' },
            state: { type: 'string', example: 'Maharashtra' },
            city: { type: 'string', example: 'Mumbai' },
            pinCode: { type: 'string', example: '400001' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            storeId: 1,
            storeName: 'Main Store',
            storeCode: 'STORE001',
            storeImageUrl: 'store-images/main-store.jpg',
            addressLine1: '123 Main Street',
            addressLine2: 'Suite 100',
            country: 'India',
            state: 'Maharashtra',
            city: 'Mumbai',
            pinCode: '400001',
            isActive: true,
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T10:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'STORE_NOT_FOUND' },
        message: { type: 'string', example: 'Store details not available' },
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
    description: 'Failed to retrieve store',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<StandardApiResponse<StoreResponseDto>> {
    return this.storeService.findOne(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Create a new store',
    description: 'Creates a new store with the provided information. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiBody({
    type: CreateStoreDto,
    description: 'Store creation data',
    examples: {
      example1: {
        summary: 'Create Store Example',
        description: 'Example of store creation data',
        value: {
          storeName: 'New Store',
          storeCode: 'STORE003',
          addressLine1: '789 New Address',
          addressLine2: 'Floor 2',
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
          pinCode: '560001',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Store successfully created',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'STORE_CREATED',
        },
        message: {
          type: 'string',
          example: 'Store created successfully',
        },
        data: {
          type: 'object',
          properties: {
            storeId: { type: 'number', example: 3 },
            storeName: { type: 'string', example: 'New Store' },
            storeCode: { type: 'string', example: 'STORE003' },
            storeImageUrl: { type: 'string', example: null, nullable: true },
            addressLine1: { type: 'string', example: '789 New Address' },
            addressLine2: { type: 'string', example: 'Floor 2', nullable: true },
            country: { type: 'string', example: 'India' },
            state: { type: 'string', example: 'Karnataka' },
            city: { type: 'string', example: 'Bangalore' },
            pinCode: { type: 'string', example: '560001' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            storeId: 3,
            storeName: 'New Store',
            storeCode: 'STORE003',
            storeImageUrl: null,
            addressLine1: '789 New Address',
            addressLine2: 'Floor 2',
            country: 'India',
            state: 'Karnataka',
            city: 'Bangalore',
            pinCode: '560001',
            isActive: true,
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
    description: 'Store code already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'STORE_CODE_EXISTS' },
        message: { type: 'string', example: 'Store code already exists' },
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
    description: 'Failed to create store',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async create(@Body() createStoreDto: CreateStoreDto): Promise<StandardApiResponse<StoreResponseDto>> {
    return this.storeService.create(createStoreDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Update store by ID',
    description: 'Updates an existing store with the provided information. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Store ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateStoreDto,
    description: 'Store update data',
    examples: {
      example1: {
        summary: 'Update Store Example',
        description: 'Example of store update data',
        value: {
          storeName: 'Updated Store Name',
          storeCode: 'UPDATED001',
          addressLine1: '456 Updated Address',
          addressLine2: 'Suite 200',
          country: 'Updated Country',
          state: 'Updated State',
          city: 'Updated City',
          pinCode: '400002',
          isActive: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store successfully updated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'STORE_UPDATED',
        },
        message: {
          type: 'string',
          example: 'Store updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            storeId: { type: 'number', example: 1 },
            storeName: { type: 'string', example: 'Updated Store Name' },
            storeCode: { type: 'string', example: 'UPDATED001' },
            storeImageUrl: { type: 'string', example: 'store-images/main-store.jpg', nullable: true },
            addressLine1: { type: 'string', example: '456 Updated Address' },
            addressLine2: { type: 'string', example: 'Suite 200', nullable: true },
            country: { type: 'string', example: 'Updated Country' },
            state: { type: 'string', example: 'Updated State' },
            city: { type: 'string', example: 'Updated City' },
            pinCode: { type: 'string', example: '400002' },
            isActive: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T11:00:00.000Z' },
          },
          example: {
            storeId: 1,
            storeName: 'Updated Store Name',
            storeCode: 'UPDATED001',
            storeImageUrl: 'store-images/main-store.jpg',
            addressLine1: '456 Updated Address',
            addressLine2: 'Suite 200',
            country: 'Updated Country',
            state: 'Updated State',
            city: 'Updated City',
            pinCode: '400002',
            isActive: false,
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T11:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'STORE_NOT_FOUND' },
        message: { type: 'string', example: 'Store details not available' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Store code already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'STORE_CODE_EXISTS' },
        message: { type: 'string', example: 'Store code already exists' },
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
    description: 'Failed to update store',
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
    @Body() updateStoreDto: UpdateStoreDto
  ): Promise<StandardApiResponse<StoreResponseDto>> {
    return this.storeService.update(+id, updateStoreDto);
  }
}
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
import { UserStoreService } from './user-store.service';
import { CreateUserStoreDto, UpdateUserStoreDto, BulkUserStoreDto, UserStoreResponseDto, BulkOperationResultDto, StoreUsersResponseDto, UserStoresResponseDto } from './dto/user-store.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { RolesGuard, JwtAuthGuard } from '../../shared/guards';
import { Roles } from '../../shared/decorators/roles.decorator';
import { DynamicResponse } from '../../shared/decorators/dynamic-response.decorator';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('User Store Mappings')
@Controller('user-stores')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class UserStoreController {
  constructor(private readonly userStoreService: UserStoreService) {}

  @Get('store/:storeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user store mappings by store ID',
    description: 'Retrieves all user store mappings for a specific store with detailed user information. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'Store ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user store mappings for store',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'STORE_USERS_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'Store user mappings retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            store: {
              type: 'object',
              properties: {
                storeId: { type: 'number', example: 1 },
                storeName: { type: 'string', example: 'Main Store' },
                storeCode: { type: 'string', example: 'STORE001' },
                storeImageUrl: { type: 'string', example: 'https://example.com/store1.jpg', nullable: true },
                addressLine1: { type: 'string', example: '123 Main St' },
                addressLine2: { type: 'string', example: 'Suite 100', nullable: true },
                country: { type: 'string', example: 'USA' },
                state: { type: 'string', example: 'CA' },
                city: { type: 'string', example: 'San Francisco' },
                pinCode: { type: 'string', example: '94105' },
                isActive: { type: 'boolean', example: true }
              }
            },
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      userId: { type: 'number', example: 1 },
                      userName: { type: 'string', example: 'john_doe' },
                      firstName: { type: 'string', example: 'John' },
                      middleName: { type: 'string', example: 'Michael', nullable: true },
                      lastName: { type: 'string', example: 'Doe' },
                      emailId: { type: 'string', example: 'john.doe@example.com', nullable: true },
                      mobile: { type: 'string', example: '+1234567890', nullable: true },
                      isActive: { type: 'boolean', example: true },
                      role: {
                        type: 'object',
                        properties: {
                          roleId: { type: 'number', example: 1 },
                          roleName: { type: 'string', example: 'Admin' }
                        }
                      }
                    }
                  },
                  mapping: {
                    type: 'object',
                    properties: {
                      userStoreId: { type: 'number', example: 1 },
                      isActive: { type: 'boolean', example: true },
                      assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
                      unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
                      createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
                      updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' }
                    }
                  }
                }
              },
              example: {
                store: {
                  storeId: 1,
                  storeName: 'Main Store',
                  storeCode: 'STORE001',
                  storeImageUrl: 'https://example.com/store1.jpg',
                  addressLine1: '123 Main St',
                  addressLine2: 'Suite 100',
                  country: 'USA',
                  state: 'CA',
                  city: 'San Francisco',
                  pinCode: '94105',
                  isActive: true
                },
                users: [
                  {
                    user: {
                      userId: 1,
                      userName: 'john_doe',
                      firstName: 'John',
                      middleName: 'Michael',
                      lastName: 'Doe',
                      emailId: 'john.doe@example.com',
                      mobile: '+1234567890',
                      isActive: true,
                      role: {
                        roleId: 1,
                        roleName: 'Admin'
                      }
                    },
                    mapping: {
                      userStoreId: 1,
                      isActive: true,
                      assignedAt: '2023-07-15T10:30:00.000Z',
                      unAssignedAt: null,
                      createdAt: '2023-07-15T10:30:00.000Z',
                      updatedAt: '2023-07-15T10:30:00.000Z'
                    }
                  }
                ]
              }
            }
          }
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
        message: { type: 'string', example: 'Store not found' },
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
    description: 'Failed to retrieve user store mappings',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findByStoreId(@Param('storeId') storeId: string): Promise<StandardApiResponse<StoreUsersResponseDto>> {
    return this.userStoreService.findStoreUsers(+storeId);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user store mappings by user ID',
    description: 'Retrieves all user store mappings for a specific user with detailed store information. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user store mappings for user',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_STORES_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'User store mappings retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                userId: { type: 'number', example: 1 },
                userName: { type: 'string', example: 'john_doe' },
                firstName: { type: 'string', example: 'John' },
                middleName: { type: 'string', example: 'Michael', nullable: true },
                lastName: { type: 'string', example: 'Doe' },
                emailId: { type: 'string', example: 'john.doe@example.com', nullable: true },
                mobile: { type: 'string', example: '+1234567890', nullable: true },
                isActive: { type: 'boolean', example: true },
                role: {
                  type: 'object',
                  properties: {
                    roleId: { type: 'number', example: 1 },
                    roleName: { type: 'string', example: 'Admin' }
                  }
                }
              }
            },
            stores: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  store: {
                    type: 'object',
                    properties: {
                      storeId: { type: 'number', example: 1 },
                      storeName: { type: 'string', example: 'Main Store' },
                      storeCode: { type: 'string', example: 'STORE001' },
                      storeImageUrl: { type: 'string', example: 'https://example.com/store1.jpg', nullable: true },
                      addressLine1: { type: 'string', example: '123 Main St' },
                      addressLine2: { type: 'string', example: 'Suite 100', nullable: true },
                      country: { type: 'string', example: 'USA' },
                      state: { type: 'string', example: 'CA' },
                      city: { type: 'string', example: 'San Francisco' },
                      pinCode: { type: 'string', example: '94105' },
                      isActive: { type: 'boolean', example: true }
                    }
                  },
                  mapping: {
                    type: 'object',
                    properties: {
                      userStoreId: { type: 'number', example: 1 },
                      isActive: { type: 'boolean', example: true },
                      assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
                      unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
                      createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
                      updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' }
                    }
                  }
                }
              },
              example: {
                user: {
                  userId: 1,
                  userName: 'john_doe',
                  firstName: 'John',
                  middleName: 'Michael',
                  lastName: 'Doe',
                  emailId: 'john.doe@example.com',
                  mobile: '+1234567890',
                  isActive: true,
                  role: {
                    roleId: 1,
                    roleName: 'Admin'
                  }
                },
                stores: [
                  {
                    store: {
                      storeId: 1,
                      storeName: 'Main Store',
                      storeCode: 'STORE001',
                      storeImageUrl: 'https://example.com/store1.jpg',
                      addressLine1: '123 Main St',
                      addressLine2: 'Suite 100',
                      country: 'USA',
                      state: 'CA',
                      city: 'San Francisco',
                      pinCode: '94105',
                      isActive: true
                    },
                    mapping: {
                      userStoreId: 1,
                      isActive: true,
                      assignedAt: '2023-07-15T10:30:00.000Z',
                      unAssignedAt: null,
                      createdAt: '2023-07-15T10:30:00.000Z',
                      updatedAt: '2023-07-15T10:30:00.000Z'
                    }
                  }
                ]
              }
            }
          }
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
        message: { type: 'string', example: 'User not found' },
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
    description: 'Failed to retrieve user store mappings',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findByUserId(@Param('userId') userId: string): Promise<StandardApiResponse<UserStoresResponseDto>> {
    return this.userStoreService.findUserStores(+userId);
  }

  @Get(':userId/:storeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user store mapping by user and store ID',
    description: 'Retrieves a specific user store mapping by user ID and store ID. Requires authentication with a valid JWT token.',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'Store ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user store mapping',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_STORE_RETRIEVED',
        },
        message: {
          type: 'string',
          example: 'User store mapping retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            userStoreId: { type: 'number', example: 1 },
            userId: { type: 'number', example: 1 },
            storeId: { type: 'number', example: 1 },
            isActive: { type: 'boolean', example: true },
            assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            userStoreId: 1,
            userId: 1,
            storeId: 1,
            isActive: true,
            assignedAt: '2023-07-15T10:30:00.000Z',
            unAssignedAt: null,
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-15T10:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User store mapping not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_STORE_NOT_FOUND' },
        message: { type: 'string', example: 'User store mapping not found' },
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
    description: 'Failed to retrieve user store mapping',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findOne(
    @Param('userId') userId: string, 
    @Param('storeId') storeId: string
  ): Promise<StandardApiResponse<UserStoreResponseDto>> {
    return this.userStoreService.findOne(+userId, +storeId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Create a new user store mapping',
    description: 'Creates a new user store mapping. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiBody({
    type: CreateUserStoreDto,
    description: 'User store mapping creation data',
    examples: {
      example1: {
        summary: 'Create User Store Mapping Example',
        description: 'Example of user store mapping creation data',
        value: {
          userId: 1,
          storeId: 1,
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User store mapping successfully created',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_STORE_CREATED',
        },
        message: {
          type: 'string',
          example: 'User store mapping created successfully',
        },
        data: {
          type: 'object',
          properties: {
            userStoreId: { type: 'number', example: 1 },
            userId: { type: 'number', example: 1 },
            storeId: { type: 'number', example: 1 },
            isActive: { type: 'boolean', example: true },
            assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
          },
          example: {
            userStoreId: 1,
            userId: 1,
            storeId: 1,
            isActive: true,
            assignedAt: '2023-07-15T10:30:00.000Z',
            unAssignedAt: null,
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
    status: HttpStatus.NOT_FOUND,
    description: 'User or store not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'User not found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User store mapping already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_STORE_MAPPING_EXISTS' },
        message: { type: 'string', example: 'User store mapping already exists' },
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
    description: 'Failed to create user store mapping',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async create(@Body() createUserStoreDto: CreateUserStoreDto): Promise<StandardApiResponse<UserStoreResponseDto>> {
    return this.userStoreService.create(createUserStoreDto);
  }

  @Put(':userId/:storeId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Update user store mapping',
    description: 'Updates an existing user store mapping. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'Store ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserStoreDto,
    description: 'User store mapping update data',
    examples: {
      example1: {
        summary: 'Update User Store Mapping Example',
        description: 'Example of user store mapping update data',
        value: {
          isActive: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User store mapping successfully updated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'USER_STORE_UPDATED',
        },
        message: {
          type: 'string',
          example: 'User store mapping updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            userStoreId: { type: 'number', example: 1 },
            userId: { type: 'number', example: 1 },
            storeId: { type: 'number', example: 1 },
            isActive: { type: 'boolean', example: false },
            assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: '2023-07-16T10:30:00.000Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-07-16T10:30:00.000Z' },
          },
          example: {
            userStoreId: 1,
            userId: 1,
            storeId: 1,
            isActive: false,
            assignedAt: '2023-07-15T10:30:00.000Z',
            unAssignedAt: '2023-07-16T10:30:00.000Z',
            createdAt: '2023-07-15T10:30:00.000Z',
            updatedAt: '2023-07-16T10:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User store mapping not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_STORE_NOT_FOUND' },
        message: { type: 'string', example: 'User store mapping not found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User already active/inactive in store',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'string', example: 'USER_ALREADY_ACTIVE' },
        message: { type: 'string', example: 'User is already active in this store' },
        data: {
          type: 'object',
          properties: {
            userStoreId: { type: 'number' },
            userId: { type: 'number' },
            storeId: { type: 'number' },
            isActive: { type: 'boolean' },
            assignedAt: { type: 'string', format: 'date-time' },
            unAssignedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
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
    description: 'Failed to update user store mapping',
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
    @Param('userId') userId: string, 
    @Param('storeId') storeId: string,
    @Body() updateDto: UpdateUserStoreDto
  ): Promise<StandardApiResponse<UserStoreResponseDto>> {
    return this.userStoreService.update(+userId, +storeId, updateDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Bulk update user store mappings',
    description: 'Performs bulk operations on user store mappings. Requires authentication with a valid JWT token and Admin/Manager role.',
  })
  @ApiBody({
    type: BulkUserStoreDto,
    description: 'Bulk user store mapping operation data',
    examples: {
      example1: {
        summary: 'Bulk User Store Mappings Example',
        description: 'Example of bulk user store mappings with different stores and users',
        value: {
          mappings: [
            {
              storeId: 1,
              userId: 1,
              isActive: true
            },
            {
              storeId: 1,
              userId: 2,
              isActive: false
            },
            {
              storeId: 2,
              userId: 3,
              isActive: true
            }
          ]
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bulk operation completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'BULK_OPERATION_COMPLETED',
        },
        message: {
          type: 'string',
          example: 'Bulk operation completed successfully',
        },
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Bulk operation completed successfully' },
            summary: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 5 },
                processed: { type: 'number', example: 4 },
                skipped: { type: 'number', example: 1 },
                failed: { type: 'number', example: 0 },
              },
            },
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'number' },
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  skipped: { type: 'boolean' },
                },
              },
              example: [
                {
                  userId: 1,
                  success: true,
                  message: 'User added to store successfully',
                  skipped: false,
                },
                {
                  userId: 2,
                  success: true,
                  message: 'User activated in store successfully',
                  skipped: false,
                },
                {
                  userId: 3,
                  success: true,
                  message: 'User store mapping does not exist, skipped',
                  skipped: true,
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bulk operation completed with some failures',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        code: {
          type: 'string',
          example: 'BULK_OPERATION_PARTIAL',
        },
        message: {
          type: 'string',
          example: 'Bulk operation completed with some failures',
        },
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Bulk operation completed with some failures' },
            summary: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 5 },
                processed: { type: 'number', example: 3 },
                skipped: { type: 'number', example: 1 },
                failed: { type: 'number', example: 1 },
              },
            },
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'number' },
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  skipped: { type: 'boolean' },
                },
              },
              example: [
                {
                  userId: 1,
                  success: true,
                  message: 'User added to store successfully',
                  skipped: false,
                },
                {
                  userId: 2,
                  success: false,
                  message: 'Failed to process user',
                  skipped: false,
                },
                {
                  userId: 3,
                  success: true,
                  message: 'User store mapping does not exist, skipped',
                  skipped: true,
                },
              ],
            },
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
        message: { type: 'string', example: 'Store not found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid user IDs',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INVALID_USER_IDS' },
        message: { type: 'string', example: 'Some user IDs are invalid or users do not exist' },
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
    description: 'Failed to perform bulk operation',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async bulkUpdate(@Body() bulkDto: BulkUserStoreDto): Promise<StandardApiResponse<BulkOperationResultDto>> {
    return this.userStoreService.bulkUpdate(bulkDto);
  }
}
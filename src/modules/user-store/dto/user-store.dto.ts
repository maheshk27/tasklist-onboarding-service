import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserStoreDto {
  @IsNumber()
  @ApiProperty({ 
    example: 1,
    description: 'User ID'
  })
  userId: number;

  @IsNumber()
  @ApiProperty({ 
    example: 1,
    description: 'Store ID'
  })
  storeId: number;

  @IsBoolean()
  @ApiProperty({ 
    example: true,
    description: 'Whether the user is active in this store'
  })
  isActive: boolean;
}

export class UpdateUserStoreDto {
  @IsBoolean()
  @ApiProperty({ 
    example: false,
    description: 'Whether the user should be active in this store'
  })
  isActive: boolean;
}

export class BulkUserStoreItemDto {
  @IsNumber()
  @ApiProperty({ 
    example: 1,
    description: 'Store ID'
  })
  storeId: number;

  @IsNumber()
  @ApiProperty({ 
    example: 1,
    description: 'User ID'
  })
  userId: number;

  @IsBoolean()
  @ApiProperty({ 
    example: true,
    description: 'Whether the user should be active in this store'
  })
  isActive: boolean;
}

export class BulkUserStoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUserStoreItemDto)
  @ApiProperty({ 
    type: 'array',
    items: {
      type: 'object',
      properties: {
        storeId: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        isActive: { type: 'boolean', example: true }
      }
    },
    description: 'Array of user store mappings for bulk operations'
  })
  mappings: BulkUserStoreItemDto[];
}

export class UserStoreResponseDto {
  @ApiProperty({ example: 1 })
  userStoreId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  storeId: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  assignedAt: Date;

  @ApiPropertyOptional({ example: null })
  unAssignedAt?: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class StoreDetailsDto {
  @ApiProperty({ example: 1 })
  storeId: number;

  @ApiProperty({ example: 'Main Store' })
  storeName: string;

  @ApiProperty({ example: 'STORE001' })
  storeCode: string;

  @ApiPropertyOptional({ example: 'https://example.com/store1.jpg' })
  storeImageUrl?: string;

  @ApiProperty({ example: '123 Main St' })
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Suite 100' })
  addressLine2?: string;

  @ApiProperty({ example: 'USA' })
  country: string;

  @ApiProperty({ example: 'CA' })
  state: string;

  @ApiProperty({ example: 'San Francisco' })
  city: string;

  @ApiProperty({ example: '94105' })
  pinCode: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UserDetailsDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'john_doe' })
  userName: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Michael' })
  middleName?: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  emailId?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  mobile?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: 'object', properties: {
    roleId: { type: 'number', example: 1 },
    roleName: { type: 'string', example: 'Admin' }
  }})
  role: {
    roleId: number;
    roleName: string;
  };
}

export class UserStoreMappingDto {
  @ApiProperty({ example: 1 })
  userStoreId: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  assignedAt: Date;

  @ApiPropertyOptional({ example: null })
  unAssignedAt?: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class StoreUsersResponseDto {
  @ApiProperty({ type: StoreDetailsDto })
  store: StoreDetailsDto;

  @ApiProperty({ type: 'array', items: {
    type: 'object',
    properties: {
      user: { type: 'object', properties: {
        userId: { type: 'number', example: 1 },
        userName: { type: 'string', example: 'john_doe' },
        firstName: { type: 'string', example: 'John' },
        middleName: { type: 'string', example: 'Michael', nullable: true },
        lastName: { type: 'string', example: 'Doe' },
        emailId: { type: 'string', example: 'john.doe@example.com', nullable: true },
        mobile: { type: 'string', example: '+1234567890', nullable: true },
        isActive: { type: 'boolean', example: true },
        role: { type: 'object', properties: {
          roleId: { type: 'number', example: 1 },
          roleName: { type: 'string', example: 'Admin' }
        }}
      }},
      mapping: { type: 'object', properties: {
        userStoreId: { type: 'number', example: 1 },
        isActive: { type: 'boolean', example: true },
        assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
        unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
        createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' }
      }}
    }
  }})
  users: Array<{
    user: UserDetailsDto;
    mapping: UserStoreMappingDto;
  }>;
}

export class UserStoresResponseDto {
  @ApiProperty({ type: 'object', properties: {
    userId: { type: 'number', example: 1 },
    userName: { type: 'string', example: 'john_doe' },
    firstName: { type: 'string', example: 'John' },
    middleName: { type: 'string', example: 'Michael', nullable: true },
    lastName: { type: 'string', example: 'Doe' },
    emailId: { type: 'string', example: 'john.doe@example.com', nullable: true },
    mobile: { type: 'string', example: '+1234567890', nullable: true },
    isActive: { type: 'boolean', example: true },
    role: { type: 'object', properties: {
      roleId: { type: 'number', example: 1 },
      roleName: { type: 'string', example: 'Admin' }
    }}
  }})
  user: UserDetailsDto;

  @ApiProperty({ type: 'array', items: {
    type: 'object',
    properties: {
      store: { type: 'object', properties: {
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
      }},
      mapping: { type: 'object', properties: {
        userStoreId: { type: 'number', example: 1 },
        isActive: { type: 'boolean', example: true },
        assignedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
        unAssignedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
        createdAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2023-07-15T10:30:00.000Z' }
      }}
    }
  }})
  stores: Array<{
    store: StoreDetailsDto;
    mapping: UserStoreMappingDto;
  }>;
}

export class BulkOperationResultDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Bulk operation completed successfully' })
  message: string;

  @ApiProperty({ 
    type: 'object',
    properties: {
      total: { type: 'number', example: 5 },
      processed: { type: 'number', example: 4 },
      skipped: { type: 'number', example: 1 },
      failed: { type: 'number', example: 0 }
    }
  })
  summary: {
    total: number;
    processed: number;
    skipped: number;
    failed: number;
  };

  @ApiProperty({ 
    type: 'array',
    items: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        storeId: { type: 'number' },
        success: { type: 'boolean' },
        message: { type: 'string' },
        skipped: { type: 'boolean' }
      }
    }
  })
  results: Array<{
    userId: number;
    storeId: number;
    success: boolean;
    message: string;
    skipped: boolean;
  }>;
}

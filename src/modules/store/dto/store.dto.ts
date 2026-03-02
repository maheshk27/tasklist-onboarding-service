import { IsString, IsNotEmpty, IsBoolean, IsOptional, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Main Store',
    description: 'Store name (2-100 characters)'
  })
  storeName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({ 
    example: 'STORE001',
    description: 'Unique store code (2-50 characters)'
  })
  storeCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  @ApiProperty({ 
    example: '123 Main Street',
    description: 'Store address line 1 (5-200 characters)'
  })
  addressLine1: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  @ApiProperty({ 
    example: 'Suite 100',
    description: 'Store address line 2 (optional, 0-200 characters)',
    required: false
  })
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'India',
    description: 'Country name (2-100 characters)'
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Maharashtra',
    description: 'State name (2-100 characters)'
  })
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Mumbai',
    description: 'City name (2-100 characters)'
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  @ApiProperty({ 
    example: '400001',
    description: 'Pin code (4-10 characters)'
  })
  pinCode: string;

  @IsBoolean()
  @ApiProperty({ 
    example: true,
    description: 'Whether the store is active'
  })
  isActive: boolean;
}

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Updated Store Name',
    description: 'Updated store name (2-100 characters)',
    required: false
  })
  storeName?: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiProperty({ 
    example: 'UPDATED001',
    description: 'Updated store code (2-50 characters)',
    required: false
  })
  storeCode?: string;

  @IsString()
  @IsOptional()
  @Length(5, 200)
  @ApiProperty({ 
    example: '456 Updated Address',
    description: 'Updated store address line 1 (5-200 characters)',
    required: false
  })
  addressLine1?: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  @ApiProperty({ 
    example: 'Suite 200',
    description: 'Updated store address line 2 (optional, 0-200 characters)',
    required: false
  })
  addressLine2?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Updated Country',
    description: 'Updated country name (2-100 characters)',
    required: false
  })
  country?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Updated State',
    description: 'Updated state name (2-100 characters)',
    required: false
  })
  state?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Updated City',
    description: 'Updated city name (2-100 characters)',
    required: false
  })
  city?: string;

  @IsString()
  @IsOptional()
  @Length(4, 10)
  @ApiProperty({ 
    example: '400002',
    description: 'Updated pin code (4-10 characters)',
    required: false
  })
  pinCode?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ 
    example: false,
    description: 'Updated active status',
    required: false
  })
  isActive?: boolean;
}

export class StoreResponseDto {
  @ApiProperty({ example: 1 })
  storeId: number;

  @ApiProperty({ example: 'Main Store' })
  storeName: string;

  @ApiProperty({ example: 'STORE001' })
  storeCode: string;

  @ApiProperty({ example: 'store-images/main-store.jpg' })
  storeImageUrl?: string;

  @ApiProperty({ example: '123 Main Street' })
  addressLine1: string;

  @ApiProperty({ example: 'Suite 100' })
  addressLine2?: string;

  @ApiProperty({ example: 'India' })
  country: string;

  @ApiProperty({ example: 'Maharashtra' })
  state: string;

  @ApiProperty({ example: 'Mumbai' })
  city: string;

  @ApiProperty({ example: '400001' })
  pinCode: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}
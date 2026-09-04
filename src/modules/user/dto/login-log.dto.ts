import { IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginStatusEnum } from 'tasklist-manager-database-core';

/**
 * Query parameters for fetching login logs across a date range.
 */
export class LoginLogQueryDto {
  @ApiPropertyOptional({
    description: 'User ID to fetch login logs for (optional). When omitted, logs are fetched for all users.',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({
    example: '2024-05-01',
    description: 'Include login logs created from this date (ISO format)',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2024-05-31',
    description: 'Include login logs created up to this date (ISO format)',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

/**
 * Query parameters for fetching users who have NOT logged in within a date range.
 * Unlike LoginLogQueryDto this intentionally has no userId field.
 */
export class NonLoginUsersQueryDto {
  @ApiPropertyOptional({
    example: '2024-05-01',
    description: 'Fetch users who have not logged in from this date (ISO format). When neither fromDate nor toDate is provided, today\'s range is used.',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2024-05-31',
    description: 'Fetch users who have not logged in up to this date (ISO format). When neither fromDate nor toDate is provided, today\'s range is used.',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

/**
 * Login log entry returned to consumers.
 */
export class LoginLogResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the login log entry',
    example: 1,
  })
  loginLogId: number;

  @ApiProperty({
    description: 'User ID associated with the login attempt (null for unknown users)',
    example: 1,
    required: false,
  })
  userId?: number;

  @ApiProperty({
    description: 'Username used for the login attempt',
    example: 'jane_smith',
  })
  userName: string;

  @ApiProperty({
    description: 'Client IP address of the login attempt',
    example: '192.168.1.10',
    required: false,
  })
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent / device information of the login attempt',
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    required: false,
  })
  userAgent?: string;

  @ApiProperty({
    description: 'Login attempt status',
    enum: LoginStatusEnum,
    example: LoginStatusEnum.SUCCESS,
  })
  loginStatus: LoginStatusEnum;

  @ApiProperty({
    description: 'Reason when the login attempt failed',
    example: 'INVALID_CREDENTIALS',
    required: false,
  })
  failureReason?: string;

  @ApiProperty({
    description: 'Date and time when the login attempt was recorded',
    example: '2023-07-15T10:30:00.000Z',
  })
  createdAt: Date;
}
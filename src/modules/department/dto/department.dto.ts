import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Engineering',
    description: 'Department name (2-100 characters)'
  })
  departmentName: string;
}

export class UpdateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    example: 'Engineering Department',
    description: 'Updated department name (2-100 characters)'
  })
  departmentName: string;
}

export class DepartmentResponseDto {
  @ApiProperty({ example: 1 })
  departmentId: number;

  @ApiProperty({ example: 'Engineering' })
  departmentName: string;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-15T10:30:00.000Z' })
  updatedAt: Date;
}
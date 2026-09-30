import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionResponseDto } from './dto/permission.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { JwtAuthGuard } from '../../shared/guards';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all permissions', description: 'Retrieves the permission catalog ordered by module and sequence.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permissions retrieved successfully', type: [PermissionResponseDto] })
  async findAll(): Promise<StandardApiResponse<PermissionResponseDto[]>> {
    return this.permissionService.findAll();
  }

  @Get('module/:moduleCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get permissions by module', description: 'Retrieves all permissions for a module/menu code.' })
  @ApiParam({ name: 'moduleCode', example: 'ADMIN_ROLE_MANAGEMENT' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permissions retrieved successfully', type: [PermissionResponseDto] })
  async findByModule(@Param('moduleCode') moduleCode: string): Promise<StandardApiResponse<PermissionResponseDto[]>> {
    return this.permissionService.findByModule(moduleCode);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission retrieved successfully', type: PermissionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  async findOne(@Param('id') id: string): Promise<StandardApiResponse<PermissionResponseDto>> {
    return this.permissionService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a permission' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Permission created successfully', type: PermissionResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Permission code already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid action type' })
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<StandardApiResponse<PermissionResponseDto>> {
    return this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission updated successfully', type: PermissionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Permission code already exists' })
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<StandardApiResponse<PermissionResponseDto>> {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a permission', description: 'Blocked while the permission is mapped to any role.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Permission is mapped to one or more roles' })
  async remove(@Param('id') id: string): Promise<StandardApiResponse<null>> {
    return this.permissionService.remove(+id);
  }
}

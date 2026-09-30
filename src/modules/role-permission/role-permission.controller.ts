import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RolePermissionService } from './role-permission.service';
import {
  UpdateRolePermissionsDto,
  RolePermissionResponseDto,
  RolePermissionMatrixDto,
  RolePermissionBulkResultDto,
  MyPermissionsDto,
} from './dto/role-permission.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { JwtAuthGuard } from '../../shared/guards';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Role Permissions')
@Controller('role-permissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Get('my-permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get permissions for the current user',
    description: 'Returns the granted permission codes for the authenticated user role (taken from the JWT payload). Used by the portals to gate actions.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Current user permissions retrieved successfully', type: MyPermissionsDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role associated with the current user was not found' })
  async getMyPermissions(@Req() req: { user: { roleName: string } }): Promise<StandardApiResponse<MyPermissionsDto>> {
    return this.rolePermissionService.getMyPermissions(req.user?.roleName);
  }

  @Get('role/:roleId/matrix')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get the permission matrix for a role',
    description: 'Returns every active permission with an `enabled` flag indicating whether the role currently holds it.',
  })
  @ApiParam({ name: 'roleId', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role permission matrix retrieved successfully', type: RolePermissionMatrixDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async getMatrixForRole(@Param('roleId') roleId: string): Promise<StandardApiResponse<RolePermissionMatrixDto>> {
    return this.rolePermissionService.getMatrixForRole(+roleId);
  }

  @Get('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get permissions granted to a role', description: 'Retrieves the role-to-permission mapping rows for the given role.' })
  @ApiParam({ name: 'roleId', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role permissions retrieved successfully', type: [RolePermissionResponseDto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async findByRole(@Param('roleId') roleId: string): Promise<StandardApiResponse<RolePermissionResponseDto[]>> {
    return this.rolePermissionService.findByRole(+roleId);
  }

  @Put('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Replace all permissions for a role',
    description: 'Sets the complete list of permissions granted to a role. Existing grants not present in permissionIds are revoked.',
  })
  @ApiParam({ name: 'roleId', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role permissions updated successfully', type: RolePermissionBulkResultDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'One or more permission IDs are invalid' })
  async replaceForRole(@Param('roleId') roleId: string, @Body() updateDto: UpdateRolePermissionsDto): Promise<StandardApiResponse<RolePermissionBulkResultDto>> {
    return this.rolePermissionService.replaceForRole(+roleId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a permission from a role', description: 'Deletes a single role-to-permission mapping row by its ID.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission unassigned from role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role permission mapping not found' })
  async remove(@Param('id') id: string): Promise<StandardApiResponse<null>> {
    return this.rolePermissionService.remove(+id);
  }
}

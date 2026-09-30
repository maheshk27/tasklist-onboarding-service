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
import { RoleMenuService } from './role-menu.service';
import { AssignRoleMenuDto, BulkRoleMenuDto, RoleMenuResponseDto, RoleMenuBulkResultDto, MenuRoleResponseDto } from './dto/role-menu.dto';
import { MenuTreeNodeDto } from '../menu/dto/menu.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { JwtAuthGuard } from '../../shared/guards';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Role Menu Mappings')
@Controller('role-menus')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class RoleMenuController {
  constructor(private readonly roleMenuService: RoleMenuService) {}

  @Get('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get menu mappings for a role', description: 'Retrieves all role-to-menu mapping rows for the given role.' })
  @ApiParam({ name: 'roleId', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role menu mappings retrieved successfully', type: [RoleMenuResponseDto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async findByRole(@Param('roleId') roleId: string): Promise<StandardApiResponse<RoleMenuResponseDto[]>> {
    return this.roleMenuService.findByRole(+roleId);
  }

  @Get('role/:roleId/menus')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get the effective menu tree for a role',
    description: 'Returns the nested navigation tree (active menus only) that a role is allowed to see. Used by the admin and staff portals to render the sidebar.',
  })
  @ApiParam({ name: 'roleId', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menus for role retrieved successfully', type: [MenuTreeNodeDto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async findMenusForRole(@Param('roleId') roleId: string): Promise<StandardApiResponse<MenuTreeNodeDto[]>> {
    return this.roleMenuService.findMenusForRole(+roleId);
  }

  @Get('menu/:menuId/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get roles mapped to a menu', description: 'Retrieves all roles that are mapped to the given menu.' })
  @ApiParam({ name: 'menuId', type: 'number', example: 5 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Roles mapped to menu retrieved successfully', type: [MenuRoleResponseDto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu not found' })
  async findRolesForMenu(@Param('menuId') menuId: string): Promise<StandardApiResponse<MenuRoleResponseDto[]>> {
    return this.roleMenuService.findRolesForMenu(+menuId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a menu to a role' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Menu assigned to role successfully', type: RoleMenuResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Menu is already assigned to this role' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or menu not found' })
  async assign(@Body() assignRoleMenuDto: AssignRoleMenuDto): Promise<StandardApiResponse<RoleMenuResponseDto>> {
    return this.roleMenuService.assign(assignRoleMenuDto);
  }

  @Put('role/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Replace all menu mappings for a role',
    description: 'Sets the complete list of menus for a role. Existing mappings not present in menuIds are removed.',
  })
  @ApiParam({ name: 'roleId', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role menu mappings updated successfully', type: RoleMenuBulkResultDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'One or more menu IDs are invalid' })
  async replaceForRole(@Param('roleId') roleId: string, @Body() bulkRoleMenuDto: BulkRoleMenuDto): Promise<StandardApiResponse<RoleMenuBulkResultDto>> {
    return this.roleMenuService.replaceForRole(+roleId, bulkRoleMenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unassign a menu from a role', description: 'Deletes a single role-to-menu mapping row by its ID.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu unassigned from role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role menu mapping not found' })
  async remove(@Param('id') id: string): Promise<StandardApiResponse<null>> {
    return this.roleMenuService.remove(+id);
  }
}

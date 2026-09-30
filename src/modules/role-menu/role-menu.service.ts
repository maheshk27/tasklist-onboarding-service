import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  AssignRoleMenuDto,
  BulkRoleMenuDto,
  RoleMenuResponseDto,
  RoleMenuBulkResultDto,
  MenuRoleResponseDto,
} from './dto/role-menu.dto';
import { MenuTreeNodeDto } from '../menu/dto/menu.dto';
import { Menu, Role, RoleMenu } from 'tasklist-manager-database-core';
import { MenuService } from '../menu/menu.service';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { RoleMenuResponseCodes } from './constants/role-menu-response-codes';
import { MenuResponseCodes } from '../menu/constants/menu-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class RoleMenuService {
  constructor(
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private menuService: MenuService,
  ) {}

  private mapToResponse(roleMenu: RoleMenu): RoleMenuResponseDto {
    return {
      roleMenuId: roleMenu.roleMenuId,
      roleId: roleMenu.roleId,
      menuId: roleMenu.menuId,
      roleName: roleMenu.role?.roleName,
      menuName: roleMenu.menu?.menuName,
      menuCode: roleMenu.menu?.menuCode,
      createdAt: roleMenu.createdAt,
      updatedAt: roleMenu.updatedAt,
    };
  }

  async findByRole(roleId: number): Promise<ApiResponse<RoleMenuResponseDto[]>> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const roleMenus = await this.roleMenuRepository.find({
        where: { roleId },
        relations: ['menu'],
      });

      return ResponseBuilder.success(roleMenus.map(roleMenu => this.mapToResponse(roleMenu)), RoleMenuResponseCodes.ROLE_MENUS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve role menu mappings');
    }
  }

  /**
   * Effective navigation tree for a role: only active menus that are explicitly
   * mapped to the role. Parents are included when their children are mapped.
   */
  async findMenusForRole(roleId: number): Promise<ApiResponse<MenuTreeNodeDto[]>> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const roleMenus = await this.roleMenuRepository.find({
        where: { roleId },
        relations: ['menu'],
      });

      const menus = roleMenus
        .map(roleMenu => roleMenu.menu)
        .filter((menu): menu is Menu => !!menu && menu.isActive);

      return ResponseBuilder.success(this.menuService.buildTree(menus), RoleMenuResponseCodes.ROLE_MENUS_MENU_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve menus for role');
    }
  }

  async findRolesForMenu(menuId: number): Promise<ApiResponse<MenuRoleResponseDto[]>> {
    try {
      const menu = await this.menuRepository.findOne({ where: { menuId } });
      if (!menu) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_NOT_FOUND);
      }

      const roleMenus = await this.roleMenuRepository.find({
        where: { menuId },
        relations: ['role'],
      });

      const data: MenuRoleResponseDto[] = roleMenus
        .filter(roleMenu => !!roleMenu.role)
        .map(roleMenu => ({
          menuId: roleMenu.menuId,
          roleId: roleMenu.roleId,
          roleName: roleMenu.role.roleName,
        }));

      return ResponseBuilder.success(data, RoleMenuResponseCodes.ROLE_MENUS_ROLES_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve roles for menu');
    }
  }

  async assign(assignRoleMenuDto: AssignRoleMenuDto): Promise<ApiResponse<RoleMenuResponseDto>> {
    try {
      const { roleId, menuId } = assignRoleMenuDto;

      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const menu = await this.menuRepository.findOne({ where: { menuId } });
      if (!menu) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_NOT_FOUND);
      }

      const existing = await this.roleMenuRepository.findOne({ where: { roleId, menuId } });
      if (existing) {
        return ResponseBuilder.error(RoleMenuResponseCodes.ROLE_MENU_ALREADY_EXISTS);
      }

      const roleMenu = this.roleMenuRepository.create({ roleId, menuId });
      const saved = await this.roleMenuRepository.save(roleMenu);

      const response: RoleMenuResponseDto = {
        ...this.mapToResponse(saved),
        roleName: role.roleName,
        menuName: menu.menuName,
        menuCode: menu.menuCode,
      };

      return ResponseBuilder.success(response, RoleMenuResponseCodes.ROLE_MENU_CREATED);
    } catch (error) {
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(RoleMenuResponseCodes.ROLE_MENU_ALREADY_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to assign menu to role');
    }
  }

  /**
   * Replace the complete set of menus assigned to a role.
   * Existing mappings not present in the payload are removed.
   */
  async replaceForRole(roleId: number, bulkRoleMenuDto: BulkRoleMenuDto): Promise<ApiResponse<RoleMenuBulkResultDto>> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const uniqueMenuIds = Array.from(new Set(bulkRoleMenuDto.menuIds ?? []));

      if (uniqueMenuIds.length > 0) {
        const menus = await this.menuRepository.find({ where: { menuId: In(uniqueMenuIds) } });
        if (menus.length !== uniqueMenuIds.length) {
          return ResponseBuilder.error(RoleMenuResponseCodes.ROLE_MENU_INVALID_MENU_IDS);
        }
      }

      const existing = await this.roleMenuRepository.find({ where: { roleId } });
      const existingMenuIds = new Set(existing.map(roleMenu => roleMenu.menuId));

      const toRemove = existing.filter(roleMenu => !uniqueMenuIds.includes(roleMenu.menuId));
      const toAdd = uniqueMenuIds.filter(menuId => !existingMenuIds.has(menuId));

      if (toRemove.length > 0) {
        await this.roleMenuRepository.remove(toRemove);
      }

      if (toAdd.length > 0) {
        const newMappings = toAdd.map(menuId => this.roleMenuRepository.create({ roleId, menuId }));
        await this.roleMenuRepository.save(newMappings);
      }

      const result: RoleMenuBulkResultDto = {
        roleId,
        menuIds: uniqueMenuIds,
        assigned: toAdd.length,
        removed: toRemove.length,
      };

      return ResponseBuilder.success(result, RoleMenuResponseCodes.ROLE_MENUS_ASSIGNED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to update role menu mappings');
    }
  }

  async remove(roleMenuId: number): Promise<ApiResponse<null>> {
    try {
      const roleMenu = await this.roleMenuRepository.findOne({ where: { roleMenuId } });
      if (!roleMenu) {
        return ResponseBuilder.error(RoleMenuResponseCodes.ROLE_MENU_NOT_FOUND);
      }

      await this.roleMenuRepository.remove(roleMenu);

      return ResponseBuilder.success(null, RoleMenuResponseCodes.ROLE_MENU_DELETED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to unassign menu from role');
    }
  }
}

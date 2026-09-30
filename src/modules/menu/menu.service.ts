import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto, MenuTreeNodeDto } from './dto/menu.dto';
import { Menu, RoleMenu } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { MenuResponseCodes } from './constants/menu-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

/** Portals a menu row can belong to. `BOTH` is shared between the two portals. */
const ALLOWED_PORTALS = ['ADMIN', 'STAFF', 'BOTH'];

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
  ) {}

  private mapToResponse(menu: Menu): MenuResponseDto {
    return {
      menuId: menu.menuId,
      parentId: menu.parentId ?? null,
      menuCode: menu.menuCode,
      menuName: menu.menuName,
      icon: menu.icon ?? null,
      routePath: menu.routePath ?? null,
      portal: menu.portal,
      sequence: menu.sequence,
      isActive: menu.isActive,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  /**
   * Turn a flat menu list into a nested parent/child tree.
   * Rows whose parent is not present in the list are treated as roots.
   * Public so other modules (e.g. role-menu permissions) can reuse it.
   */
  buildTree(menus: Menu[]): MenuTreeNodeDto[] {
    const nodes = new Map<number, MenuTreeNodeDto>();
    const roots: MenuTreeNodeDto[] = [];

    menus.forEach(menu => {
      nodes.set(menu.menuId, { ...this.mapToResponse(menu), children: [] });
    });

    nodes.forEach(node => {
      if (node.parentId && nodes.has(node.parentId)) {
        nodes.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const sortNodes = (list: MenuTreeNodeDto[]) => {
      list.sort((a, b) => (a.sequence - b.sequence) || (a.menuId - b.menuId));
      list.forEach(child => sortNodes(child.children));
    };
    sortNodes(roots);

    return roots;
  }

  private isValidPortal(portal?: string): boolean {
    return !!portal && ALLOWED_PORTALS.includes(portal.toUpperCase());
  }

  async findAll(): Promise<ApiResponse<MenuResponseDto[]>> {
    try {
      const menus = await this.menuRepository.find({
        order: { portal: 'ASC', sequence: 'ASC', menuId: 'ASC' },
      });

      return ResponseBuilder.success(menus.map(menu => this.mapToResponse(menu)), MenuResponseCodes.MENUS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve menus');
    }
  }

  async findByPortal(portal: string): Promise<ApiResponse<MenuResponseDto[]>> {
    try {
      if (!this.isValidPortal(portal)) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_INVALID_PORTAL);
      }

      const menus = await this.menuRepository.find({
        where: [{ portal: portal.toUpperCase() }, { portal: 'BOTH' }],
        order: { sequence: 'ASC', menuId: 'ASC' },
      });

      return ResponseBuilder.success(menus.map(menu => this.mapToResponse(menu)), MenuResponseCodes.MENUS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve menus');
    }
  }

  async findTree(portal?: string): Promise<ApiResponse<MenuTreeNodeDto[]>> {
    try {
      if (portal && !this.isValidPortal(portal)) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_INVALID_PORTAL);
      }

      const menus = portal
        ? await this.menuRepository.find({
            where: [{ portal: portal.toUpperCase() }, { portal: 'BOTH' }],
            order: { sequence: 'ASC', menuId: 'ASC' },
          })
        : await this.menuRepository.find({ order: { sequence: 'ASC', menuId: 'ASC' } });

      return ResponseBuilder.success(this.buildTree(menus), MenuResponseCodes.MENU_TREE_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve menu tree');
    }
  }

  async findOne(menuId: number): Promise<ApiResponse<MenuResponseDto>> {
    try {
      const menu = await this.menuRepository.findOne({ where: { menuId } });

      if (!menu) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_NOT_FOUND);
      }

      return ResponseBuilder.success(this.mapToResponse(menu), MenuResponseCodes.MENU_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve menu');
    }
  }

  async create(createMenuDto: CreateMenuDto): Promise<ApiResponse<MenuResponseDto>> {
    try {
      const { menuCode, parentId, portal } = createMenuDto;

      if (!this.isValidPortal(portal)) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_INVALID_PORTAL);
      }

      const existingMenu = await this.menuRepository.findOne({ where: { menuCode } });
      if (existingMenu) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_CODE_EXISTS);
      }

      if (parentId !== undefined && parentId !== null) {
        const parent = await this.menuRepository.findOne({ where: { menuId: parentId } });
        if (!parent) {
          return ResponseBuilder.error(MenuResponseCodes.MENU_PARENT_NOT_FOUND);
        }
      }

      const menu = this.menuRepository.create({
        ...createMenuDto,
        portal: portal.toUpperCase(),
        isActive: createMenuDto.isActive ?? true,
        sequence: createMenuDto.sequence ?? 0,
      });
      const savedMenu = await this.menuRepository.save(menu);

      return ResponseBuilder.success(this.mapToResponse(savedMenu), MenuResponseCodes.MENU_CREATED);
    } catch (error) {
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(MenuResponseCodes.MENU_CODE_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to create menu');
    }
  }

  async update(menuId: number, updateMenuDto: UpdateMenuDto): Promise<ApiResponse<MenuResponseDto>> {
    try {
      const menu = await this.menuRepository.findOne({ where: { menuId } });
      if (!menu) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_NOT_FOUND);
      }

      if (updateMenuDto.menuCode && updateMenuDto.menuCode !== menu.menuCode) {
        const existingMenu = await this.menuRepository.findOne({ where: { menuCode: updateMenuDto.menuCode } });
        if (existingMenu) {
          return ResponseBuilder.error(MenuResponseCodes.MENU_CODE_EXISTS);
        }
      }

      if (updateMenuDto.portal && !this.isValidPortal(updateMenuDto.portal)) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_INVALID_PORTAL);
      }

      if (updateMenuDto.parentId !== undefined && updateMenuDto.parentId !== null) {
        if (updateMenuDto.parentId === menuId) {
          return ResponseBuilder.error(MenuResponseCodes.MENU_SELF_PARENT);
        }

        const parent = await this.menuRepository.findOne({ where: { menuId: updateMenuDto.parentId } });
        if (!parent) {
          return ResponseBuilder.error(MenuResponseCodes.MENU_PARENT_NOT_FOUND);
        }

        // Guard against a circular hierarchy (walk up the parent chain)
        let ancestor: Menu | null = parent;
        const visited = new Set<number>([menuId]);
        while (ancestor) {
          if (visited.has(ancestor.menuId)) {
            return ResponseBuilder.error(MenuResponseCodes.MENU_PARENT_CYCLE);
          }
          visited.add(ancestor.menuId);
          if (ancestor.parentId === null || ancestor.parentId === undefined) {
            break;
          }
          ancestor = await this.menuRepository.findOne({ where: { menuId: ancestor.parentId } });
        }
      }

      Object.assign(menu, updateMenuDto);
      if (updateMenuDto.portal) {
        menu.portal = updateMenuDto.portal.toUpperCase();
      }
      // Explicitly allow moving a menu back to top level (null parent)
      if (updateMenuDto.parentId === null) {
        menu.parentId = null;
      }

      const updatedMenu = await this.menuRepository.save(menu);

      return ResponseBuilder.success(this.mapToResponse(updatedMenu), MenuResponseCodes.MENU_UPDATED);
    } catch (error) {
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(MenuResponseCodes.MENU_CODE_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to update menu');
    }
  }

  async remove(menuId: number): Promise<ApiResponse<null>> {
    try {
      const menu = await this.menuRepository.findOne({ where: { menuId } });
      if (!menu) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_NOT_FOUND);
      }

      const childCount = await this.menuRepository.count({ where: { parentId: menuId } });
      if (childCount > 0) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_HAS_CHILDREN);
      }

      const roleMappingCount = await this.roleMenuRepository.count({ where: { menuId } });
      if (roleMappingCount > 0) {
        return ResponseBuilder.error(MenuResponseCodes.MENU_IN_USE);
      }

      await this.menuRepository.remove(menu);

      return ResponseBuilder.success(null, MenuResponseCodes.MENU_DELETED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to delete menu');
    }
  }
}

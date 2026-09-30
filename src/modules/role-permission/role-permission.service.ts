import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  UpdateRolePermissionsDto,
  RolePermissionResponseDto,
  RolePermissionMatrixDto,
  RolePermissionBulkResultDto,
  PermissionMatrixItemDto,
  MyPermissionsDto,
} from './dto/role-permission.dto';
import { RolePermission, Role, Permission } from 'tasklist-manager-database-core';
import { PermissionActionEnum } from '../../shared/enums/permission-action.enum';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { RolePermissionResponseCodes } from './constants/role-permission-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  private mapToResponse(rolePermission: RolePermission): RolePermissionResponseDto {
    return {
      rolePermissionId: rolePermission.rolePermissionId,
      roleId: rolePermission.roleId,
      permissionId: rolePermission.permissionId,
      permissionCode: rolePermission.permission?.permissionCode,
      permissionName: rolePermission.permission?.permissionName,
      createdAt: rolePermission.createdAt,
      updatedAt: rolePermission.updatedAt,
    };
  }

  async findByRole(roleId: number): Promise<ApiResponse<RolePermissionResponseDto[]>> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const rolePermissions = await this.rolePermissionRepository.find({
        where: { roleId },
        relations: ['permission'],
      });

      return ResponseBuilder.success(
        rolePermissions.map(rolePermission => this.mapToResponse(rolePermission)),
        RolePermissionResponseCodes.ROLE_PERMISSIONS_RETRIEVED,
      );
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve role permissions');
    }
  }

  /**
   * Permission matrix for a role: every active permission in the catalog with an
   * `enabled` flag indicating whether the role currently holds it.
   */
  async getMatrixForRole(roleId: number): Promise<ApiResponse<RolePermissionMatrixDto>> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const permissions = await this.permissionRepository.find({
        where: { isActive: true },
        order: { moduleCode: 'ASC', sequence: 'ASC', permissionId: 'ASC' },
      });

      const rolePermissions = await this.rolePermissionRepository.find({ where: { roleId } });
      const grantedIds = new Set(rolePermissions.map(rolePermission => rolePermission.permissionId));

      const matrix: PermissionMatrixItemDto[] = permissions.map(permission => ({
        permissionId: permission.permissionId,
        permissionCode: permission.permissionCode,
        permissionName: permission.permissionName,
        moduleCode: permission.moduleCode ?? null,
        actionType: permission.actionType as PermissionActionEnum,
        enabled: grantedIds.has(permission.permissionId),
      }));

      const result: RolePermissionMatrixDto = {
        roleId: role.roleId,
        roleName: role.roleName,
        permissions: matrix,
      };

      return ResponseBuilder.success(result, RolePermissionResponseCodes.ROLE_PERMISSION_MATRIX_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve role permission matrix');
    }
  }

  /**
   * Effective permission codes for the authenticated user's role. The role name
   * comes from the JWT payload, so no extra user lookup is required.
   */
  async getMyPermissions(roleName: string): Promise<ApiResponse<MyPermissionsDto>> {
    try {
      if (!roleName) {
        return ResponseBuilder.error(RolePermissionResponseCodes.ROLE_PERMISSION_ROLE_NOT_FOUND);
      }

      const role = await this.roleRepository
        .createQueryBuilder('role')
        .where('LOWER(TRIM(role.roleName)) = LOWER(TRIM(:roleName))', { roleName })
        .getOne();

      if (!role) {
        return ResponseBuilder.error(RolePermissionResponseCodes.ROLE_PERMISSION_ROLE_NOT_FOUND);
      }

      const rolePermissions = await this.rolePermissionRepository.find({
        where: { roleId: role.roleId },
        relations: ['permission'],
      });

      const permissions = rolePermissions
        .filter(rolePermission => !!rolePermission.permission && rolePermission.permission.isActive)
        .map(rolePermission => rolePermission.permission.permissionCode);

      const result: MyPermissionsDto = {
        roleId: role.roleId,
        roleName: role.roleName,
        permissions,
      };

      return ResponseBuilder.success(result, RolePermissionResponseCodes.MY_PERMISSIONS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve current user permissions');
    }
  }

  /**
   * Replace the complete set of permissions granted to a role.
   * Existing grants not present in the payload are revoked.
   */
  async replaceForRole(roleId: number, updateDto: UpdateRolePermissionsDto): Promise<ApiResponse<RolePermissionBulkResultDto>> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const uniquePermissionIds = Array.from(new Set(updateDto.permissionIds ?? []));

      if (uniquePermissionIds.length > 0) {
        const permissions = await this.permissionRepository.find({ where: { permissionId: In(uniquePermissionIds) } });
        if (permissions.length !== uniquePermissionIds.length) {
          return ResponseBuilder.error(RolePermissionResponseCodes.ROLE_PERMISSION_INVALID_IDS);
        }
      }

      const existing = await this.rolePermissionRepository.find({ where: { roleId } });
      const existingIds = new Set(existing.map(rolePermission => rolePermission.permissionId));

      const toRemove = existing.filter(rolePermission => !uniquePermissionIds.includes(rolePermission.permissionId));
      const toAdd = uniquePermissionIds.filter(permissionId => !existingIds.has(permissionId));

      if (toRemove.length > 0) {
        await this.rolePermissionRepository.remove(toRemove);
      }

      if (toAdd.length > 0) {
        const newMappings = toAdd.map(permissionId => this.rolePermissionRepository.create({ roleId, permissionId }));
        await this.rolePermissionRepository.save(newMappings);
      }

      const result: RolePermissionBulkResultDto = {
        roleId,
        permissionIds: uniquePermissionIds,
        assigned: toAdd.length,
        removed: toRemove.length,
      };

      return ResponseBuilder.success(result, RolePermissionResponseCodes.ROLE_PERMISSIONS_UPDATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to update role permissions');
    }
  }

  async remove(rolePermissionId: number): Promise<ApiResponse<null>> {
    try {
      const rolePermission = await this.rolePermissionRepository.findOne({ where: { rolePermissionId } });
      if (!rolePermission) {
        return ResponseBuilder.error(RolePermissionResponseCodes.ROLE_PERMISSION_NOT_FOUND);
      }

      await this.rolePermissionRepository.remove(rolePermission);

      return ResponseBuilder.success(null, RolePermissionResponseCodes.ROLE_PERMISSION_DELETED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to unassign permission from role');
    }
  }
}

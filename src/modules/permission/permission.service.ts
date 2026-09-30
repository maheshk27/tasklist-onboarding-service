import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto, UpdatePermissionDto, PermissionResponseDto } from './dto/permission.dto';
import { Permission, RolePermission } from 'tasklist-manager-database-core';
import { PermissionActionEnum } from '../../shared/enums/permission-action.enum';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { PermissionResponseCodes } from './constants/permission-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

/** Allowed permission actions (validated at the API layer; stored as varchar). */
const VALID_ACTION_TYPES = Object.values(PermissionActionEnum) as string[];

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  private mapToResponse(permission: Permission): PermissionResponseDto {
    return {
      permissionId: permission.permissionId,
      permissionCode: permission.permissionCode,
      permissionName: permission.permissionName,
      moduleCode: permission.moduleCode ?? null,
      actionType: permission.actionType as PermissionActionEnum,
      description: permission.description ?? null,
      sequence: permission.sequence,
      isActive: permission.isActive,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  private isValidActionType(actionType?: string): boolean {
    return !!actionType && VALID_ACTION_TYPES.includes(actionType.toUpperCase());
  }

  async findAll(): Promise<ApiResponse<PermissionResponseDto[]>> {
    try {
      const permissions = await this.permissionRepository.find({
        order: { moduleCode: 'ASC', sequence: 'ASC', permissionId: 'ASC' },
      });

      return ResponseBuilder.success(permissions.map(permission => this.mapToResponse(permission)), PermissionResponseCodes.PERMISSIONS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve permissions');
    }
  }

  async findByModule(moduleCode: string): Promise<ApiResponse<PermissionResponseDto[]>> {
    try {
      const permissions = await this.permissionRepository.find({
        where: { moduleCode },
        order: { sequence: 'ASC', permissionId: 'ASC' },
      });

      return ResponseBuilder.success(permissions.map(permission => this.mapToResponse(permission)), PermissionResponseCodes.PERMISSIONS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve permissions');
    }
  }

  async findOne(permissionId: number): Promise<ApiResponse<PermissionResponseDto>> {
    try {
      const permission = await this.permissionRepository.findOne({ where: { permissionId } });
      if (!permission) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_NOT_FOUND);
      }

      return ResponseBuilder.success(this.mapToResponse(permission), PermissionResponseCodes.PERMISSION_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve permission');
    }
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<ApiResponse<PermissionResponseDto>> {
    try {
      const { permissionCode, actionType } = createPermissionDto;

      if (!this.isValidActionType(actionType)) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_INVALID_ACTION_TYPE);
      }

      const existing = await this.permissionRepository.findOne({ where: { permissionCode } });
      if (existing) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_CODE_EXISTS);
      }

      const permission = this.permissionRepository.create({
        ...createPermissionDto,
        actionType: actionType.toUpperCase() as PermissionActionEnum,
        isActive: createPermissionDto.isActive ?? true,
        sequence: createPermissionDto.sequence ?? 0,
      });
      const saved = await this.permissionRepository.save(permission);

      return ResponseBuilder.success(this.mapToResponse(saved), PermissionResponseCodes.PERMISSION_CREATED);
    } catch (error) {
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_CODE_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to create permission');
    }
  }

  async update(permissionId: number, updatePermissionDto: UpdatePermissionDto): Promise<ApiResponse<PermissionResponseDto>> {
    try {
      const permission = await this.permissionRepository.findOne({ where: { permissionId } });
      if (!permission) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_NOT_FOUND);
      }

      if (updatePermissionDto.permissionCode && updatePermissionDto.permissionCode !== permission.permissionCode) {
        const existing = await this.permissionRepository.findOne({ where: { permissionCode: updatePermissionDto.permissionCode } });
        if (existing) {
          return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_CODE_EXISTS);
        }
      }

      if (updatePermissionDto.actionType && !this.isValidActionType(updatePermissionDto.actionType)) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_INVALID_ACTION_TYPE);
      }

      Object.assign(permission, updatePermissionDto);
      if (updatePermissionDto.actionType) {
        permission.actionType = updatePermissionDto.actionType.toUpperCase() as PermissionActionEnum;
      }

      const updated = await this.permissionRepository.save(permission);

      return ResponseBuilder.success(this.mapToResponse(updated), PermissionResponseCodes.PERMISSION_UPDATED);
    } catch (error) {
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_CODE_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to update permission');
    }
  }

  async remove(permissionId: number): Promise<ApiResponse<null>> {
    try {
      const permission = await this.permissionRepository.findOne({ where: { permissionId } });
      if (!permission) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_NOT_FOUND);
      }

      const mappingCount = await this.rolePermissionRepository.count({ where: { permissionId } });
      if (mappingCount > 0) {
        return ResponseBuilder.error(PermissionResponseCodes.PERMISSION_IN_USE);
      }

      await this.permissionRepository.remove(permission);

      return ResponseBuilder.success(null, PermissionResponseCodes.PERMISSION_DELETED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to delete permission');
    }
  }
}

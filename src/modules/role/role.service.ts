import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from './dto/role.dto';
import { Role } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { RoleResponseCodes } from './constants/role-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<ApiResponse<RoleResponseDto[]>> {
    try {
      const roles = await this.roleRepository.find();

      const roleData = roles.map(role => ({
        roleId: role.roleId,
        roleName: role.roleName,
        reportingTo: role.reportingTo ?? null,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));

      return ResponseBuilder.success(roleData, RoleResponseCodes.ROLES_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve roles');
    }
  }

  async findOne(roleId: number): Promise<ApiResponse<RoleResponseDto>> {
    try {
      const role = await this.roleRepository.findOne({
        where: { roleId },
      });

      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      const roleData: RoleResponseDto = {
        roleId: role.roleId,
        roleName: role.roleName,
        reportingTo: role.reportingTo ?? null,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };

      return ResponseBuilder.success(roleData, RoleResponseCodes.ROLE_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve role');
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<ApiResponse<RoleResponseDto>> {
    try {
      const { roleName, reportingTo } = createRoleDto;

      // Check if role name already exists (unique constraint)
      const existingRole = await this.roleRepository.findOne({ 
        where: { roleName } 
      });
      
      if (existingRole) {
        return ResponseBuilder.error(RoleResponseCodes.ROLE_NAME_EXISTS);
      }

      // Validate the parent role exists when reportingTo is provided (self join to mst_role)
      if (reportingTo !== undefined && reportingTo !== null) {
        const parentRole = await this.roleRepository.findOne({
          where: { roleId: reportingTo }
        });

        if (!parentRole) {
          return ResponseBuilder.error(RoleResponseCodes.ROLE_REPORTING_TO_NOT_FOUND);
        }
      }

      // Create role
      const role = this.roleRepository.create(createRoleDto);
      const savedRole = await this.roleRepository.save(role);

      const roleData: RoleResponseDto = {
        roleId: savedRole.roleId,
        roleName: savedRole.roleName,
        reportingTo: savedRole.reportingTo ?? null,
        createdAt: savedRole.createdAt,
        updatedAt: savedRole.updatedAt,
      };

      return ResponseBuilder.success(roleData, RoleResponseCodes.ROLE_CREATED);
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(RoleResponseCodes.ROLE_NAME_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to create role');
    }
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto): Promise<ApiResponse<RoleResponseDto>> {
    try {
      const role = await this.roleRepository.findOne({
        where: { roleId },
      });

      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      // If roleName is being updated, check for uniqueness
      if (updateRoleDto.roleName && updateRoleDto.roleName !== role.roleName) {
        const existingRole = await this.roleRepository.findOne({ 
          where: { roleName: updateRoleDto.roleName } 
        });
        
        if (existingRole) {
          return ResponseBuilder.error(RoleResponseCodes.ROLE_NAME_EXISTS);
        }
      }

      // Validate reportingTo when provided (self join to mst_role)
      if (updateRoleDto.reportingTo !== undefined && updateRoleDto.reportingTo !== null) {
        // A role cannot report to itself
        if (updateRoleDto.reportingTo === roleId) {
          return ResponseBuilder.error(RoleResponseCodes.ROLE_SELF_REPORTING);
        }

        // The parent role must exist in mst_role
        const parentRole = await this.roleRepository.findOne({
          where: { roleId: updateRoleDto.reportingTo }
        });

        if (!parentRole) {
          return ResponseBuilder.error(RoleResponseCodes.ROLE_REPORTING_TO_NOT_FOUND);
        }

        // Guard against circular hierarchy (walk up the reporting chain)
        let ancestor: Role | null = parentRole;
        const visited = new Set<number>([roleId]);

        while (ancestor) {
          if (visited.has(ancestor.roleId)) {
            return ResponseBuilder.error(RoleResponseCodes.ROLE_REPORTING_CYCLE);
          }

          visited.add(ancestor.roleId);

          if (ancestor.reportingTo === null || ancestor.reportingTo === undefined) {
            break;
          }

          ancestor = await this.roleRepository.findOne({
            where: { roleId: ancestor.reportingTo }
          });
        }
      }

      // Update role data
      Object.assign(role, updateRoleDto);

      const updatedRole = await this.roleRepository.save(role);

      const roleData: RoleResponseDto = {
        roleId: updatedRole.roleId,
        roleName: updatedRole.roleName,
        reportingTo: updatedRole.reportingTo ?? null,
        createdAt: updatedRole.createdAt,
        updatedAt: updatedRole.updatedAt,
      };

      return ResponseBuilder.success(roleData, RoleResponseCodes.ROLE_UPDATED);
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(RoleResponseCodes.ROLE_NAME_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to update role');
    }
  }
}
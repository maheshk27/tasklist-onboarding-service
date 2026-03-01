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
      const { roleName } = createRoleDto;

      // Check if role name already exists (unique constraint)
      const existingRole = await this.roleRepository.findOne({ 
        where: { roleName } 
      });
      
      if (existingRole) {
        return ResponseBuilder.error(RoleResponseCodes.ROLE_NAME_EXISTS);
      }

      // Create role
      const role = this.roleRepository.create(createRoleDto);
      const savedRole = await this.roleRepository.save(role);

      const roleData: RoleResponseDto = {
        roleId: savedRole.roleId,
        roleName: savedRole.roleName,
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

      // Update role data
      Object.assign(role, updateRoleDto);

      const updatedRole = await this.roleRepository.save(role);

      const roleData: RoleResponseDto = {
        roleId: updatedRole.roleId,
        roleName: updatedRole.roleName,
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
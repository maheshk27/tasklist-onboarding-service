import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { User, Role } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { UserResponseCodes } from './constants/user-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
    try {
      const users = await this.userRepository.find({
        relations: ['role'],
      });

      const userData = users.map(user => ({
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        emailId: user.emailId,
        mobile: user.mobile,
        isActive: user.isActive,
        roleId: user.role.roleId,
        roleName: user.role.roleName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return ResponseBuilder.success(userData, UserResponseCodes.USERS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve users');
    }
  }

  async findOne(userId: number): Promise<ApiResponse<UserResponseDto>> {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['role'],
      });

      if (!user) {
        return ResponseBuilder.notFound('User');
      }

      const userData: UserResponseDto = {
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        emailId: user.emailId,
        mobile: user.mobile,
        isActive: user.isActive,
        roleId: user.role.roleId,
        roleName: user.role.roleName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return ResponseBuilder.success(userData, UserResponseCodes.USER_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve user');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
    const { userName, roleId, ...userData } = createUserDto;

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { userName } });
      if (existingUser) {
        return ResponseBuilder.error(UserResponseCodes.USERNAME_EXISTS);
      }

      // Find role
      const role = await this.roleRepository.findOne({ where: { roleId: roleId } });
      if (!role) {
        return ResponseBuilder.error(UserResponseCodes.ROLE_NOT_FOUND);
      }

      // Create user
      const user = this.userRepository.create({
        ...userData,
        roleId: role.roleId,
        role,
        isActive: true,
      });

      const savedUser = await this.userRepository.save(user);

      const userDataResponse: UserResponseDto = {
        userId: savedUser.userId,
        userName: savedUser.userName,
        firstName: savedUser.firstName,
        middleName: savedUser.middleName,
        lastName: savedUser.lastName,
        emailId: savedUser.emailId,
        mobile: savedUser.mobile,
        isActive: savedUser.isActive,
        roleId: savedUser.role.roleId,
        roleName: role.roleName,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };

      return ResponseBuilder.success(userDataResponse, UserResponseCodes.USER_CREATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to create user');
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<ApiResponse<UserResponseDto>> {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['role'],
      });

      if (!user) {
        return ResponseBuilder.notFound('User');
      }

      // Update user data
      Object.assign(user, updateUserDto);

      // If role is being updated, find the new role
      if (updateUserDto.roleId && updateUserDto.roleId !== user.role.roleId) {
        const role = await this.roleRepository.findOne({ 
          where: { roleId: updateUserDto.roleId } 
        });
        if (role) {
          user.role = role;
          user.role.roleId = role.roleId;
        }
      }

      const updatedUser = await this.userRepository.save(user);

      const userData: UserResponseDto = {
        userId: updatedUser.userId,
        userName: updatedUser.userName,
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
        mobile: updatedUser.mobile,
        isActive: updatedUser.isActive,
        roleId: updatedUser.role.roleId,
        roleName: updatedUser.role.roleName,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      return ResponseBuilder.success(userData, UserResponseCodes.USER_UPDATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to update user');
    }
  }

  async activateUser(userId: number): Promise<ApiResponse<null>> {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) {
        return ResponseBuilder.notFound('User');
      }

      if (user.isActive) {
        return ResponseBuilder.error(UserResponseCodes.USER_ALREADY_ACTIVE || {
          code: 'USER_ALREADY_ACTIVE',
          message: 'User is already active'
        });
      }

      user.isActive = true;
      await this.userRepository.save(user);

      return ResponseBuilder.success(null, UserResponseCodes.USER_ACTIVATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to activate user');
    }
  }

  async deactivateUser(userId: number): Promise<ApiResponse<null>> {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) {
        return ResponseBuilder.notFound('User');
      }

      if (!user.isActive) {
        return ResponseBuilder.error(UserResponseCodes.USER_ALREADY_INACTIVE || {
          code: 'USER_ALREADY_INACTIVE',
          message: 'User is already inactive'
        });
      }

      user.isActive = false;
      await this.userRepository.save(user);

      return ResponseBuilder.success(null, UserResponseCodes.USER_DEACTIVATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to deactivate user');
    }
  }
}
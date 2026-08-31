import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { LoginLogQueryDto, LoginLogResponseDto } from './dto/login-log.dto';
import { ResetPasswordDto, ChangePasswordDto } from './dto/password.dto';
import { User, Role, LoginLog } from 'tasklist-manager-database-core';
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
    @InjectRepository(LoginLog)
    private loginLogRepository: Repository<LoginLog>,
  ) {}

  async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
    try {
      const users = await this.userRepository.find({
        relations: ['role', 'department'],
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
        departmentId: user.departmentId,
        department: user.department ? {
          departmentId: user.department.departmentId,
          departmentName: user.department.departmentName,
        } : undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          roleId: user.role.roleId,
          roleName: user.role.roleName,
        },
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          roleId: user.role.roleId,
          roleName: user.role.roleName,
        },
      };

      return ResponseBuilder.success(userData, UserResponseCodes.USER_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve user');
    }
  }

  /**
   * Get the last 10 login log entries for the currently authenticated user.
   */
  async getMyLoginLogs(userId: number): Promise<ApiResponse<LoginLogResponseDto[]>> {
    try {
      const logs = await this.loginLogRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 10,
      });

      const loginLogs = logs.map(log => this.mapLoginLogToDto(log));
      return ResponseBuilder.success(loginLogs, UserResponseCodes.LOGIN_LOGS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve login logs');
    }
  }

  /**
   * Get all login log entries for either a specific user (when userId is provided)
   * or all users within an optional date range.
   * When neither fromDate nor toDate is provided, returns today's logs only.
   * Access is restricted to Admin, Manager and Supervisor roles.
   */
  async getLoginLogs(loginLogQuery: LoginLogQueryDto): Promise<ApiResponse<LoginLogResponseDto[]>> {
    try {
      const { userId, fromDate, toDate } = loginLogQuery;

      // When no date range is provided, default to today's logs only
      let effectiveFromDate = fromDate;
      let effectiveToDate = toDate;
      if (!effectiveFromDate && !effectiveToDate) {
        const today = this.getTodayDateString();
        effectiveFromDate = today;
        effectiveToDate = today;
      }

      // Only validate the user's existence when a specific user is requested
      if (userId) {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
          return ResponseBuilder.notFound('User');
        }
      }

      const queryBuilder = this.loginLogRepository.createQueryBuilder('loginLog');

      if (userId) {
        queryBuilder.where('loginLog.userId = :userId', { userId });
      }

      if (effectiveFromDate) {
        queryBuilder.andWhere('loginLog.createdAt >= :fromDate', { fromDate: effectiveFromDate });
      }
      if (effectiveToDate) {
        queryBuilder.andWhere('loginLog.createdAt <= :toDate', { toDate: this.resolveEndOfDay(effectiveToDate) });
      }

      queryBuilder.orderBy('loginLog.createdAt', 'DESC');

      const logs = await queryBuilder.getMany();
      const loginLogs = logs.map(log => this.mapLoginLogToDto(log));
      return ResponseBuilder.success(loginLogs, UserResponseCodes.LOGIN_LOGS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve login logs');
    }
  }

  /**
   * Map a LoginLog entity to its API DTO.
   */
  private mapLoginLogToDto(log: LoginLog): LoginLogResponseDto {
    return {
      loginLogId: log.loginLogId,
      userId: log.userId,
      userName: log.userName,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      loginStatus: log.loginStatus,
      failureReason: log.failureReason,
      createdAt: log.createdAt,
    };
  }

  /**
   * Expand a date-only value (YYYY-MM-DD) to the end of that day so the
   * date range filter is inclusive of the whole day.
   */
  private resolveEndOfDay(value: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T23:59:59.999`;
    }
    return value;
  }

  /**
   * Get the current date as a local YYYY-MM-DD string.
   */
  private getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ 
        where: { userName: createUserDto.userName } 
      });
      if (existingUser) {
        return ResponseBuilder.conflict('Username already exists');
      }

      // Find role
      const role = await this.roleRepository.findOne({ 
        where: { roleId: createUserDto.roleId } 
      });
      if (!role) {
        return ResponseBuilder.notFound('Role');
      }

      // Validate password length
      if (createUserDto.password.length < 6) {
        return ResponseBuilder.badRequest('Password must be at least 6 characters long');
      }

      // Create user directly from DTO
      const user = this.userRepository.create({
        ...createUserDto,
        roleId: role.roleId,
        role,
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
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        role: {
          roleId: savedUser.role.roleId,
          roleName: role.roleName,
        },
      };

      return ResponseBuilder.success(userDataResponse, UserResponseCodes.USER_CREATED);
    } catch (error) {
      console.error('Error creating user:', error);
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
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        role: {
          roleId: updatedUser.role.roleId,
          roleName: updatedUser.role.roleName,
        },
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
        return ResponseBuilder.conflict('User is already active');
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
        return ResponseBuilder.conflict('User is already inactive');
      }

      user.isActive = false;
      await this.userRepository.save(user);

      return ResponseBuilder.success(null, UserResponseCodes.USER_DEACTIVATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to deactivate user');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ApiResponse<null>> {
    try {
      const { userId, newPassword, confirmPassword } = resetPasswordDto;

      // Validate password confirmation
      if (newPassword !== confirmPassword) {
        return ResponseBuilder.badRequest('Passwords do not match');
      }

      // Validate password length
      if (newPassword.length < 6) {
        return ResponseBuilder.badRequest('Password must be at least 6 characters long');
      }

      const user = await this.userRepository.findOne({
        where: { userId },
      });

      if (!user) {
        return ResponseBuilder.notFound('User');
      }

      user.password = newPassword;
      
      await this.userRepository.save(user);

      return ResponseBuilder.success(null, UserResponseCodes.PASSWORD_RESET_SUCCESS);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to reset password');
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<ApiResponse<null>> {
    try {
      const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

      // Validate password confirmation
      if (newPassword !== confirmPassword) {
        return ResponseBuilder.badRequest('Passwords do not match');
      }

      // Validate password length
      if (newPassword.length < 6) {
        return ResponseBuilder.badRequest('Password must be at least 6 characters long');
      }

      const user = await this.userRepository.findOne({
        where: { userId },
      });

      if (!user) {
        return ResponseBuilder.notFound('User');
      }

      // Verify current password
      if (currentPassword !== user.password) {
        return ResponseBuilder.badRequest('Current password is incorrect');
      }

      // Store the new password
      user.password = newPassword;
      
      await this.userRepository.save(user);

      return ResponseBuilder.success(null, UserResponseCodes.PASSWORD_CHANGE_SUCCESS);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to change password');
    }
  }
}

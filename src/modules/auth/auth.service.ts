import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { User, Role } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { AuthResponseCodes } from './constants/auth-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async register(registerDto: RegisterDto): Promise<ApiResponse<AuthResponseDto>> {
    const { userName, password, firstName, middleName, lastName, emailId, mobile } = registerDto;

    try {
      // Check if any Admin users already exist
      const adminRole = await this.roleRepository.findOne({ where: { roleName: 'Admin' } });
      if (!adminRole) {
        return ResponseBuilder.error(AuthResponseCodes.ADMIN_ROLE_NOT_FOUND);
      }

      const existingAdmin = await this.userRepository.findOne({ 
        where: { roleId: adminRole.roleId } 
      });
      if (existingAdmin) {
        return ResponseBuilder.error(AuthResponseCodes.ADMIN_ALREADY_EXISTS);
      }
      
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { userName } });
      if (existingUser) {
        return ResponseBuilder.error(AuthResponseCodes.USERNAME_EXISTS);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with Admin role
      const user = this.userRepository.create({
        userName,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        emailId,
        mobile,
        isActive: true,
        roleId: adminRole.roleId,
        role: adminRole,
      });

      await this.userRepository.save(user);

      // Generate JWT token
      const accessToken = this.generateJwtToken(user);

      const authData: AuthResponseDto = {
        accessToken,
        user: {
          userId: user.userId,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          role: {
            roleId: adminRole.roleId,
            roleName: adminRole.roleName,
          },
        },
      };

      return ResponseBuilder.success(authData, AuthResponseCodes.REGISTRATION_SUCCESS);
    } catch (error) {
      return ResponseBuilder.internalError('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<ApiResponse<AuthResponseDto>> {
    const { userName, password } = loginDto;

    try {
      // Find user
      const user = await this.userRepository.findOne({ 
        where: { userName },
        relations: ['role']
      });

      if (!user) {
        return ResponseBuilder.error(AuthResponseCodes.USER_NOT_FOUND);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return ResponseBuilder.error(AuthResponseCodes.INVALID_CREDENTIALS);
      }

      // Generate JWT token
      const accessToken = this.generateJwtToken(user);

      const authData: AuthResponseDto = {
        accessToken,
        user: {
          userId: user.userId,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          role: {
            roleId: user.role.roleId,
            roleName: user.role.roleName,
          },
        },
      };

      return ResponseBuilder.success(authData, AuthResponseCodes.LOGIN_SUCCESS);
    } catch (error) {
      return ResponseBuilder.internalError('Login failed');
    }
  }

  private generateJwtToken(user: User): string {
    const payload = {
      userId: user.userId,
      userName: user.userName,
      roleName: user.role.roleName,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { userId },
      relations: ['role']
    });
  }
}
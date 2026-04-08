import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { User, Role } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { AuthResponseCodes } from './constants/auth-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private appConfig: AppConfig,
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

      // Create user with Admin role
      const user = this.userRepository.create({
        userName,
        password,
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

      // Generate JWT tokens
      const accessToken = this.generateJwtToken(user);
      const refreshToken = this.generateRefreshToken(user);

      const authData: AuthResponseDto = {
        accessToken,
        refreshToken,
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
      if (password !== user.password) {
        return ResponseBuilder.error(AuthResponseCodes.INVALID_CREDENTIALS);
      }

      // Generate JWT tokens
      const accessToken = this.generateJwtToken(user);
      const refreshToken = this.generateRefreshToken(user);

      const authData: AuthResponseDto = {
        accessToken,
        refreshToken,
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

    const jwtConfig = this.appConfig.getJwtConfig();
    const signOptions: jwt.SignOptions = {
      expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
      algorithm: jwtConfig.algorithm as jwt.Algorithm,
    };
    
    return jwt.sign(payload, jwtConfig.secret, signOptions);
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.userId,
      userName: user.userName,
      roleName: user.role.roleName,
    };

    const jwtConfig = this.appConfig.getJwtConfig();
    const signOptions: jwt.SignOptions = {
      expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
      algorithm: jwtConfig.algorithm as jwt.Algorithm,
    };
    
    return jwt.sign(payload, jwtConfig.secret, signOptions);
  }

  async refreshAccessToken(refreshToken: string): Promise<ApiResponse<AuthResponseDto>> {
    try {
      // Verify the refresh token
      const jwtConfig = this.appConfig.getJwtConfig();
      const decoded = jwt.verify(refreshToken, jwtConfig.secret) as any;
      
      // Find the user
      const user = await this.userRepository.findOne({ 
        where: { userId: decoded.userId },
        relations: ['role']
      });

      if (!user) {
        return ResponseBuilder.error(AuthResponseCodes.USER_NOT_FOUND);
      }

      // Generate new tokens
      const accessToken = this.generateJwtToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      const authData: AuthResponseDto = {
        accessToken,
        refreshToken: newRefreshToken,
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

      return ResponseBuilder.success(authData, AuthResponseCodes.REFRESH_TOKEN_SUCCESS);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return ResponseBuilder.error(AuthResponseCodes.REFRESH_TOKEN_EXPIRED);
      }
      return ResponseBuilder.error(AuthResponseCodes.REFRESH_TOKEN_INVALID);
    }
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { userId },
      relations: ['role']
    });
  }
}
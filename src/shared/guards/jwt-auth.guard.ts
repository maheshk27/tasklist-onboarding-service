import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AppConfig } from '../../config/app.config';

export interface JwtPayload {
  userId: number;
  userName: string;
  roleName: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private appConfig: AppConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token is required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const jwtConfig = this.appConfig.getJwtConfig();
      const payload = jwt.verify(token, jwtConfig.secret) as JwtPayload;
      
      // Attach user information to request object
      request.user = {
        userId: payload.userId,
        userName: payload.userName,
        roleName: payload.roleName,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

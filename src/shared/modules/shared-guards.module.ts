import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { DynamicResponseInterceptor } from '../interceptors/dynamic-response.interceptor';
import { AppConfig } from '../../config/app.config';

@Module({
  providers: [
    JwtAuthGuard,
    RolesGuard,
    DynamicResponseInterceptor,
    AppConfig,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    DynamicResponseInterceptor,
    AppConfig,
  ],
})
export class SharedGuardsModule {}

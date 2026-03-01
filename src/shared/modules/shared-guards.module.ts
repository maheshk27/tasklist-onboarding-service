import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { DynamicResponseInterceptor } from '../interceptors/dynamic-response.interceptor';

@Module({
  providers: [
    JwtAuthGuard,
    RolesGuard,
    DynamicResponseInterceptor,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    DynamicResponseInterceptor,
  ],
})
export class SharedGuardsModule {}

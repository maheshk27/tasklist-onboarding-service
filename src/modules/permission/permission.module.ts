import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission, RolePermission } from 'tasklist-manager-database-core';
import { SharedGuardsModule } from '../../shared/modules/shared-guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, RolePermission]),
    SharedGuardsModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}

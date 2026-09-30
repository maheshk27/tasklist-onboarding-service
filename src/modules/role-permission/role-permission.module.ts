import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { RolePermission, Role, Permission } from 'tasklist-manager-database-core';
import { SharedGuardsModule } from '../../shared/modules/shared-guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission, Role, Permission]),
    SharedGuardsModule,
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}

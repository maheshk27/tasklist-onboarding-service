import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleMenuController } from './role-menu.controller';
import { RoleMenuService } from './role-menu.service';
import { RoleMenu, Role, Menu } from 'tasklist-manager-database-core';
import { MenuModule } from '../menu/menu.module';
import { SharedGuardsModule } from '../../shared/modules/shared-guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleMenu, Role, Menu]),
    MenuModule,
    SharedGuardsModule,
  ],
  controllers: [RoleMenuController],
  providers: [RoleMenuService],
  exports: [RoleMenuService],
})
export class RoleMenuModule {}

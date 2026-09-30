import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu, RoleMenu } from 'tasklist-manager-database-core';
import { SharedGuardsModule } from '../../shared/modules/shared-guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, RoleMenu]),
    SharedGuardsModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}

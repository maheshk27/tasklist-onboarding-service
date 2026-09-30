import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { DepartmentModule } from './modules/department/department.module';
import { StoreModule } from './modules/store/store.module';
import { UserStoreModule } from './modules/user-store/user-store.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleMenuModule } from './modules/role-menu/role-menu.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { PerformanceModule } from './shared/modules/performance.module';

@Module({
  imports: [
    // Configuration module with environment-specific .env files
    ConfigModule,
    
    // Database module
    DatabaseModule,
    
    // Feature modules
    AuthModule,
    UserModule,
    RoleModule,
    DepartmentModule,
    StoreModule,
    UserStoreModule,
    MenuModule,
    RoleMenuModule,
    PermissionModule,
    RolePermissionModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

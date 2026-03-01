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
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

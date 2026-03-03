import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, Role } from 'tasklist-manager-database-core';
import { AppConfig } from '../../config/app.config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [AuthController],
  providers: [AuthService, AppConfig],
  exports: [AuthService, AppConfig],
})
export class AuthModule {}

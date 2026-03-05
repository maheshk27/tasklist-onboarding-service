import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from '../../config/app.config';
import {
  Department,
  Role,
  Store,
  User,
  UserStore,
  UserDevice,
  TaskMaster,
  TaskChecklist,
  TaskAssignment,
  TaskExecution,
  TaskChecklistExecution,
  Notification
} from 'tasklist-manager-database-core';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: AppConfig,
    }),
    TypeOrmModule.forFeature([
      Department,
      Role,
      Store,
      User,
      UserStore,
      UserDevice,
      TaskMaster,
      TaskChecklist,
      TaskAssignment,
      TaskExecution,
      TaskChecklistExecution,
      Notification
    ]),
  ],
  providers: [AppConfig],
  exports: [TypeOrmModule, AppConfig],
})
export class DatabaseModule {}

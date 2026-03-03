import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from '../../config/app.config';
import { 
  User, 
  Store, 
  TaskMaster, 
  Task, 
  TaskChecklist, 
  TaskChecklistExecution,
  TaskExecution, 
  Role, 
  UserDevice, 
  UserStore,
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
      User,
      Store,
      TaskMaster,
      Task,
      TaskChecklist,
      TaskChecklistExecution,
      TaskExecution,
      Role,
      UserDevice,
      UserStore,
      Notification
    ]),
  ],
  providers: [AppConfig],
  exports: [TypeOrmModule, AppConfig],
})
export class DatabaseModule {}

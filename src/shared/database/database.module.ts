import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database.config';
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
      useClass: DatabaseConfig,
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
  providers: [DatabaseConfig],
  exports: [TypeOrmModule, DatabaseConfig],
})
export class DatabaseModule {}

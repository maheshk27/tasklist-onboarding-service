import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStoreController } from './user-store.controller';
import { UserStoreService } from './user-store.service';
import { UserStore } from 'tasklist-manager-database-core';
import { User } from 'tasklist-manager-database-core';
import { Store } from 'tasklist-manager-database-core';
import { SharedGuardsModule } from '../../shared/modules/shared-guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStore, User, Store]),
    SharedGuardsModule,
  ],
  controllers: [UserStoreController],
  providers: [UserStoreService],
  exports: [UserStoreService],
})
export class UserStoreModule {}
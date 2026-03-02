import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserStoreDto, UpdateUserStoreDto, BulkUserStoreDto, UserStoreResponseDto, BulkOperationResultDto, StoreUsersResponseDto, UserStoresResponseDto } from './dto/user-store.dto';
import { UserStore } from 'tasklist-manager-database-core';
import { User } from 'tasklist-manager-database-core';
import { Store } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { UserStoreResponseCodes } from './constants/user-store-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class UserStoreService {
  constructor(
    @InjectRepository(UserStore)
    private userStoreRepository: Repository<UserStore>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) { }

  async findAll(): Promise<ApiResponse<UserStoreResponseDto[]>> {
    try {
      const userStores = await this.userStoreRepository.find({
        relations: ['user', 'store'],
      });

      const userStoreData = userStores.map(userStore => ({
        userStoreId: userStore.userStoreId,
        userId: userStore.userId,
        storeId: userStore.storeId,
        isActive: userStore.isActive,
        assignedAt: userStore.assignedAt,
        unAssignedAt: userStore.unAssignedAt,
        createdAt: userStore.createdAt,
        updatedAt: userStore.updatedAt,
      }));

      return ResponseBuilder.success(userStoreData, UserStoreResponseCodes.USER_STORES_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve user store mappings');
    }
  }

  async findByStoreId(storeId: number): Promise<ApiResponse<UserStoreResponseDto[]>> {
    try {
      const store = await this.storeRepository.findOne({ where: { storeId } });
      if (!store) {
        return ResponseBuilder.error(UserStoreResponseCodes.STORE_NOT_FOUND);
      }

      const userStores = await this.userStoreRepository.find({
        where: { storeId },
        relations: ['user', 'store'],
      });

      const userStoreData = userStores.map(userStore => ({
        userStoreId: userStore.userStoreId,
        userId: userStore.userId,
        storeId: userStore.storeId,
        isActive: userStore.isActive,
        assignedAt: userStore.assignedAt,
        unAssignedAt: userStore.unAssignedAt,
        createdAt: userStore.createdAt,
        updatedAt: userStore.updatedAt,
      }));

      return ResponseBuilder.success(userStoreData, UserStoreResponseCodes.USER_STORES_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve user store mappings');
    }
  }

  async findByUserId(userId: number): Promise<ApiResponse<UserStoreResponseDto[]>> {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) {
        return ResponseBuilder.error(UserStoreResponseCodes.USER_NOT_FOUND);
      }

      const userStores = await this.userStoreRepository.find({
        where: { userId },
        relations: ['user', 'store'],
      });

      const userStoreData = userStores.map(userStore => ({
        userStoreId: userStore.userStoreId,
        userId: userStore.userId,
        storeId: userStore.storeId,
        isActive: userStore.isActive,
        assignedAt: userStore.assignedAt,
        unAssignedAt: userStore.unAssignedAt,
        createdAt: userStore.createdAt,
        updatedAt: userStore.updatedAt,
      }));

      return ResponseBuilder.success(userStoreData, UserStoreResponseCodes.USER_STORES_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve user store mappings');
    }
  }

  async findOne(userId: number, storeId: number): Promise<ApiResponse<UserStoreResponseDto>> {
    try {
      const userStore = await this.userStoreRepository.findOne({
        where: { userId, storeId },
        relations: ['user', 'store'],
      });

      if (!userStore) {
        return ResponseBuilder.notFound('User store mapping');
      }

      const userStoreData: UserStoreResponseDto = {
        userStoreId: userStore.userStoreId,
        userId: userStore.userId,
        storeId: userStore.storeId,
        isActive: userStore.isActive,
        assignedAt: userStore.assignedAt,
        unAssignedAt: userStore.unAssignedAt,
        createdAt: userStore.createdAt,
        updatedAt: userStore.updatedAt,
      };

      return ResponseBuilder.success(userStoreData, UserStoreResponseCodes.USER_STORE_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve user store mapping');
    }
  }

  async create(createUserStoreDto: CreateUserStoreDto): Promise<ApiResponse<UserStoreResponseDto>> {
    try {
      const { userId, storeId, isActive } = createUserStoreDto;

      // Validate user exists
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) {
        return ResponseBuilder.error(UserStoreResponseCodes.USER_NOT_FOUND);
      }

      // Validate store exists
      const store = await this.storeRepository.findOne({ where: { storeId } });
      if (!store) {
        return ResponseBuilder.error(UserStoreResponseCodes.STORE_NOT_FOUND);
      }

      // Check if mapping already exists
      const existingMapping = await this.userStoreRepository.findOne({
        where: { userId, storeId },
      });

      if (existingMapping) {
        return ResponseBuilder.error(UserStoreResponseCodes.USER_STORE_MAPPING_EXISTS);
      }

      // Create new mapping
      const userStore = this.userStoreRepository.create({
        ...createUserStoreDto,
        assignedAt: isActive ? new Date() : null,
        unAssignedAt: isActive ? null : new Date(),
      });

      const savedUserStore = await this.userStoreRepository.save(userStore);

      const userStoreData: UserStoreResponseDto = {
        userStoreId: savedUserStore.userStoreId,
        userId: savedUserStore.userId,
        storeId: savedUserStore.storeId,
        isActive: savedUserStore.isActive,
        assignedAt: savedUserStore.assignedAt,
        unAssignedAt: savedUserStore.unAssignedAt,
        createdAt: savedUserStore.createdAt,
        updatedAt: savedUserStore.updatedAt,
      };

      return ResponseBuilder.success(userStoreData, UserStoreResponseCodes.USER_STORE_CREATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to create user store mapping');
    }
  }

  async update(userId: number, storeId: number, updateDto: UpdateUserStoreDto): Promise<ApiResponse<UserStoreResponseDto>> {
    try {
      const { isActive } = updateDto;

      // Check if mapping exists
      const userStore = await this.userStoreRepository.findOne({
        where: { userId, storeId },
      });

      if (!userStore) {
        return ResponseBuilder.notFound('User store mapping');
      }

      // Check current state
      if (userStore.isActive === isActive) {
        const responseCode = isActive
          ? UserStoreResponseCodes.USER_ALREADY_ACTIVE
          : UserStoreResponseCodes.USER_ALREADY_INACTIVE;
        return ResponseBuilder.success({
          userStoreId: userStore.userStoreId,
          userId: userStore.userId,
          storeId: userStore.storeId,
          isActive: userStore.isActive,
          assignedAt: userStore.assignedAt,
          unAssignedAt: userStore.unAssignedAt,
          createdAt: userStore.createdAt,
          updatedAt: userStore.updatedAt,
        }, responseCode);
      }

      // Update mapping based on isActive
      if (isActive) {
        // Activate the mapping
        userStore.isActive = true;
        userStore.assignedAt = new Date();
        userStore.unAssignedAt = null;
      } else {
        // Deactivate the mapping
        userStore.isActive = false;
        userStore.unAssignedAt = new Date();
      }

      const updatedUserStore = await this.userStoreRepository.save(userStore);

      const userStoreData: UserStoreResponseDto = {
        userStoreId: updatedUserStore.userStoreId,
        userId: updatedUserStore.userId,
        storeId: updatedUserStore.storeId,
        isActive: updatedUserStore.isActive,
        assignedAt: updatedUserStore.assignedAt,
        unAssignedAt: updatedUserStore.unAssignedAt,
        createdAt: updatedUserStore.createdAt,
        updatedAt: updatedUserStore.updatedAt,
      };

      return ResponseBuilder.success(userStoreData, UserStoreResponseCodes.USER_STORE_UPDATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to update user store mapping');
    }
  }

  async bulkUpdate(bulkDto: BulkUserStoreDto): Promise<ApiResponse<BulkOperationResultDto>> {
    try {
      const { mappings } = bulkDto;
      const results: Array<{
        userId: number;
        storeId: number;
        success: boolean;
        message: string;
        skipped: boolean;
      }> = [];
      let processed = 0;
      let skipped = 0;
      let failed = 0;

      // Validate all mappings
      const storeIds = [...new Set(mappings.map(m => m.storeId))];
      const userIds = [...new Set(mappings.map(m => m.userId))];

      // Validate all stores exist
      const stores = await this.storeRepository.findByIds(storeIds);
      const validStoreIds = stores.map(store => store.storeId);
      const invalidStoreIds = storeIds.filter(id => !validStoreIds.includes(id));

      if (invalidStoreIds.length > 0) {
        return ResponseBuilder.error(UserStoreResponseCodes.INVALID_STORE_ID);
      }

      // Validate all users exist
      const users = await this.userRepository.findByIds(userIds);
      const validUserIds = users.map(user => user.userId);
      const invalidUserIds = userIds.filter(id => !validUserIds.includes(id));

      if (invalidUserIds.length > 0) {
        return ResponseBuilder.error(UserStoreResponseCodes.INVALID_USER_IDS);
      }

      // Process each mapping
      for (const mapping of mappings) {
        const { storeId, userId, isActive } = mapping;
        try {
          // Check if mapping exists
          let userStore = await this.userStoreRepository.findOne({
            where: { userId, storeId },
          });

          if (isActive) {
            // Activate or create mapping
            if (userStore) {
              if (userStore.isActive) {
                results.push({
                  userId,
                  storeId,
                  success: true,
                  message: 'User is already active in this store',
                  skipped: true,
                });
                skipped++;
              } else {
                userStore.isActive = true;
                userStore.assignedAt = new Date();
                userStore.unAssignedAt = null;
                await this.userStoreRepository.save(userStore);
                results.push({
                  userId,
                  storeId,
                  success: true,
                  message: 'User activated in store successfully',
                  skipped: false,
                });
                processed++;
              }
            } else {
              // Create new active mapping
              const newUserStore = this.userStoreRepository.create({
                userId,
                storeId,
                isActive: true,
                assignedAt: new Date(),
                unAssignedAt: null,
              });
              await this.userStoreRepository.save(newUserStore);
              results.push({
                userId,
                storeId,
                success: true,
                message: 'User added to store successfully',
                skipped: false,
              });
              processed++;
            }
          } else {
            // Deactivate mapping
            if (userStore) {
              if (!userStore.isActive) {
                results.push({
                  userId,
                  storeId,
                  success: true,
                  message: 'User is already inactive in this store',
                  skipped: true,
                });
                skipped++;
              } else {
                userStore.isActive = false;
                userStore.unAssignedAt = new Date();
                await this.userStoreRepository.save(userStore);
                results.push({
                  userId,
                  storeId,
                  success: true,
                  message: 'User deactivated in store successfully',
                  skipped: false,
                });
                processed++;
              }
            } else {
              // Mapping doesn't exist, skip as per requirements
              results.push({
                userId,
                storeId,
                success: true,
                message: 'User store mapping does not exist, skipped',
                skipped: true,
              });
              skipped++;
            }
          }
        } catch (error) {
          results.push({
            userId: mapping.userId,
            storeId: mapping.storeId,
            success: false,
            message: 'Failed to process user',
            skipped: false,
          });
          failed++;
        }
      }

      const summary = {
        total: mappings.length,
        processed,
        skipped,
        failed,
      };

      const success = failed === 0;
      const message = success 
        ? 'Bulk operation completed successfully'
        : 'Bulk operation completed with some failures';

      const responseCode = success 
        ? UserStoreResponseCodes.BULK_OPERATION_COMPLETED 
        : UserStoreResponseCodes.BULK_OPERATION_PARTIAL;

      const result: BulkOperationResultDto = {
        success,
        message,
        summary,
        results,
      };

      return ResponseBuilder.success(result, responseCode);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to perform bulk operation');
    }
  }

  async findStoreUsers(storeId: number): Promise<ApiResponse<StoreUsersResponseDto>> {
    try {
      // Validate store exists
      const store = await this.storeRepository.findOne({ where: { storeId } });
      if (!store) {
        return ResponseBuilder.error(UserStoreResponseCodes.STORE_NOT_FOUND);
      }

      // Get all user stores for this store with relations
      const userStores = await this.userStoreRepository.find({
        where: { storeId },
        relations: ['user', 'user.role'],
      });

      // Map store details
      const storeDetails = {
        storeId: store.storeId,
        storeName: store.storeName,
        storeCode: store.storeCode,
        storeImageUrl: store.storeImageUrl,
        addressLine1: store.addressLine1,
        addressLine2: store.addressLine2,
        country: store.country,
        state: store.state,
        city: store.city,
        pinCode: store.pinCode,
        isActive: store.isActive,
      };

      // Map users with their mappings
      const users = userStores.map(userStore => ({
        user: {
          userId: userStore.user.userId,
          userName: userStore.user.userName,
          firstName: userStore.user.firstName,
          middleName: userStore.user.middleName,
          lastName: userStore.user.lastName,
          emailId: userStore.user.emailId,
          mobile: userStore.user.mobile,
          isActive: userStore.user.isActive,
          role: {
            roleId: userStore.user.role.roleId,
            roleName: userStore.user.role.roleName,
          },
        },
        mapping: {
          userStoreId: userStore.userStoreId,
          isActive: userStore.isActive,
          assignedAt: userStore.assignedAt,
          unAssignedAt: userStore.unAssignedAt,
          createdAt: userStore.createdAt,
          updatedAt: userStore.updatedAt,
        },
      }));

      const result: StoreUsersResponseDto = {
        store: storeDetails,
        users,
      };

      return ResponseBuilder.success(result, UserStoreResponseCodes.STORE_USERS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve store users');
    }
  }

  async findUserStores(userId: number): Promise<ApiResponse<UserStoresResponseDto>> {
    try {
      // Validate user exists
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['role']
      });
      if (!user) {
        return ResponseBuilder.error(UserStoreResponseCodes.USER_NOT_FOUND);
      }

      // Get all user stores for this user with relations
      const userStores = await this.userStoreRepository.find({
        where: { userId },
        relations: ['store'],
      });

      // Map user details
      const userDetails = {
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        emailId: user.emailId,
        mobile: user.mobile,
        isActive: user.isActive,
        role: {
          roleId: user.role.roleId,
          roleName: user.role.roleName,
        },
      };

      // Map stores with their mappings
      const stores = userStores.map(userStore => ({
        store: {
          storeId: userStore.store.storeId,
          storeName: userStore.store.storeName,
          storeCode: userStore.store.storeCode,
          storeImageUrl: userStore.store.storeImageUrl,
          addressLine1: userStore.store.addressLine1,
          addressLine2: userStore.store.addressLine2,
          country: userStore.store.country,
          state: userStore.store.state,
          city: userStore.store.city,
          pinCode: userStore.store.pinCode,
          isActive: userStore.store.isActive,
        },
        mapping: {
          userStoreId: userStore.userStoreId,
          isActive: userStore.isActive,
          assignedAt: userStore.assignedAt,
          unAssignedAt: userStore.unAssignedAt,
          createdAt: userStore.createdAt,
          updatedAt: userStore.updatedAt,
        },
      }));

      const result: UserStoresResponseDto = {
        user: userDetails,
        stores,
      };

      return ResponseBuilder.success(result, UserStoreResponseCodes.USER_STORES_RETRIEVED);
    } catch (error) {
      console.log(error);
      return ResponseBuilder.internalError('Failed to retrieve user stores');
    }
  }
}
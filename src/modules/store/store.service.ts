import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto } from './dto/store.dto';
import { Store } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { StoreResponseCodes } from './constants/store-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<ApiResponse<StoreResponseDto[]>> {
    try {
      const stores = await this.storeRepository.find();

      const storeData = stores.map(store => ({
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
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      }));

      return ResponseBuilder.success(storeData, StoreResponseCodes.STORES_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve stores');
    }
  }

  async findOne(storeId: number): Promise<ApiResponse<StoreResponseDto>> {
    try {
      const store = await this.storeRepository.findOne({
        where: { storeId },
      });

      if (!store) {
        return ResponseBuilder.notFound('Store');
      }

      const storeData: StoreResponseDto = {
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
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      };

      return ResponseBuilder.success(storeData, StoreResponseCodes.STORE_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve store');
    }
  }

  async create(createStoreDto: CreateStoreDto): Promise<ApiResponse<StoreResponseDto>> {
    try {
      const { storeCode } = createStoreDto;

      // Check if store code already exists (code-based constraint)
      const existingStore = await this.storeRepository.findOne({ 
        where: { storeCode } 
      });
      
      if (existingStore) {
        return ResponseBuilder.error(StoreResponseCodes.STORE_CODE_EXISTS);
      }

      // Create store
      const store = this.storeRepository.create(createStoreDto);
      const savedStore = await this.storeRepository.save(store);

      const storeData: StoreResponseDto = {
        storeId: savedStore.storeId,
        storeName: savedStore.storeName,
        storeCode: savedStore.storeCode,
        storeImageUrl: savedStore.storeImageUrl,
        addressLine1: savedStore.addressLine1,
        addressLine2: savedStore.addressLine2,
        country: savedStore.country,
        state: savedStore.state,
        city: savedStore.city,
        pinCode: savedStore.pinCode,
        isActive: savedStore.isActive,
        createdAt: savedStore.createdAt,
        updatedAt: savedStore.updatedAt,
      };

      return ResponseBuilder.success(storeData, StoreResponseCodes.STORE_CREATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to create store');
    }
  }

  async update(storeId: number, updateStoreDto: UpdateStoreDto): Promise<ApiResponse<StoreResponseDto>> {
    try {
      const store = await this.storeRepository.findOne({
        where: { storeId },
      });

      if (!store) {
        return ResponseBuilder.notFound('Store');
      }

      // If storeCode is being updated, check for uniqueness
      if (updateStoreDto.storeCode && updateStoreDto.storeCode !== store.storeCode) {
        const existingStore = await this.storeRepository.findOne({ 
          where: { storeCode: updateStoreDto.storeCode } 
        });
        
        if (existingStore) {
          return ResponseBuilder.error(StoreResponseCodes.STORE_CODE_EXISTS);
        }
      }

      // Update store data
      Object.assign(store, updateStoreDto);

      const updatedStore = await this.storeRepository.save(store);

      const storeData: StoreResponseDto = {
        storeId: updatedStore.storeId,
        storeName: updatedStore.storeName,
        storeCode: updatedStore.storeCode,
        storeImageUrl: updatedStore.storeImageUrl,
        addressLine1: updatedStore.addressLine1,
        addressLine2: updatedStore.addressLine2,
        country: updatedStore.country,
        state: updatedStore.state,
        city: updatedStore.city,
        pinCode: updatedStore.pinCode,
        isActive: updatedStore.isActive,
        createdAt: updatedStore.createdAt,
        updatedAt: updatedStore.updatedAt,
      };

      return ResponseBuilder.success(storeData, StoreResponseCodes.STORE_UPDATED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to update store');
    }
  }
}
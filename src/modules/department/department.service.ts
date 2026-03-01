import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentResponseDto } from './dto/department.dto';
import { Department } from 'tasklist-manager-database-core';
import { ResponseBuilder } from '../../shared/utils/response-builder';
import { DepartmentResponseCodes } from './constants/department-response-codes';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<ApiResponse<DepartmentResponseDto[]>> {
    try {
      const departments = await this.departmentRepository.find();

      const departmentData = departments.map(department => ({
        departmentId: department.departmentId,
        departmentName: department.departmentName,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      }));

      return ResponseBuilder.success(departmentData, DepartmentResponseCodes.DEPARTMENTS_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve departments');
    }
  }

  async findOne(departmentId: number): Promise<ApiResponse<DepartmentResponseDto>> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { departmentId },
      });

      if (!department) {
        return ResponseBuilder.notFound('Department');
      }

      const departmentData: DepartmentResponseDto = {
        departmentId: department.departmentId,
        departmentName: department.departmentName,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      };

      return ResponseBuilder.success(departmentData, DepartmentResponseCodes.DEPARTMENT_RETRIEVED);
    } catch (error) {
      return ResponseBuilder.internalError('Failed to retrieve department');
    }
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<ApiResponse<DepartmentResponseDto>> {
    try {
      const { departmentName } = createDepartmentDto;

      // Check if department name already exists (unique constraint)
      const existingDepartment = await this.departmentRepository.findOne({ 
        where: { departmentName } 
      });
      
      if (existingDepartment) {
        return ResponseBuilder.error(DepartmentResponseCodes.DEPARTMENT_NAME_EXISTS);
      }

      // Create department
      const department = this.departmentRepository.create(createDepartmentDto);
      const savedDepartment = await this.departmentRepository.save(department);

      const departmentData: DepartmentResponseDto = {
        departmentId: savedDepartment.departmentId,
        departmentName: savedDepartment.departmentName,
        createdAt: savedDepartment.createdAt,
        updatedAt: savedDepartment.updatedAt,
      };

      return ResponseBuilder.success(departmentData, DepartmentResponseCodes.DEPARTMENT_CREATED);
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(DepartmentResponseCodes.DEPARTMENT_NAME_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to create department');
    }
  }

  async update(departmentId: number, updateDepartmentDto: UpdateDepartmentDto): Promise<ApiResponse<DepartmentResponseDto>> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { departmentId },
      });

      if (!department) {
        return ResponseBuilder.notFound('Department');
      }

      // If departmentName is being updated, check for uniqueness
      if (updateDepartmentDto.departmentName && updateDepartmentDto.departmentName !== department.departmentName) {
        const existingDepartment = await this.departmentRepository.findOne({ 
          where: { departmentName: updateDepartmentDto.departmentName } 
        });
        
        if (existingDepartment) {
          return ResponseBuilder.error(DepartmentResponseCodes.DEPARTMENT_NAME_EXISTS);
        }
      }

      // Update department data
      Object.assign(department, updateDepartmentDto);

      const updatedDepartment = await this.departmentRepository.save(department);

      const departmentData: DepartmentResponseDto = {
        departmentId: updatedDepartment.departmentId,
        departmentName: updatedDepartment.departmentName,
        createdAt: updatedDepartment.createdAt,
        updatedAt: updatedDepartment.updatedAt,
      };

      return ResponseBuilder.success(departmentData, DepartmentResponseCodes.DEPARTMENT_UPDATED);
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505' || error.name === 'QueryFailedError') {
        return ResponseBuilder.error(DepartmentResponseCodes.DEPARTMENT_NAME_EXISTS);
      }
      return ResponseBuilder.internalError('Failed to update department');
    }
  }
}
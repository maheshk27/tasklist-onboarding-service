import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto, MenuTreeNodeDto } from './dto/menu.dto';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';
import { JwtAuthGuard } from '../../shared/guards';
import { DynamicResponseInterceptor } from '../../shared/interceptors/dynamic-response.interceptor';

@ApiTags('Menus')
@Controller('menus')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DynamicResponseInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all menus',
    description: 'Retrieves every menu row (flat list) ordered by portal, parent and sequence. Requires a valid JWT token.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menus retrieved successfully', type: [MenuResponseDto] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid JWT token' })
  async findAll(): Promise<StandardApiResponse<MenuResponseDto[]>> {
    return this.menuService.findAll();
  }

  @Get('tree')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get menu tree',
    description: 'Retrieves menus as a nested parent/child tree. Optionally filter by portal (ADMIN or STAFF); shared (BOTH) menus are always included.',
  })
  @ApiQuery({ name: 'portal', required: false, enum: ['ADMIN', 'STAFF', 'BOTH'], description: 'Filter the tree by portal' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu tree retrieved successfully', type: [MenuTreeNodeDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid portal value' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid JWT token' })
  async findTree(@Query('portal') portal?: string): Promise<StandardApiResponse<MenuTreeNodeDto[]>> {
    return this.menuService.findTree(portal);
  }

  @Get('portal/:portal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get menus by portal',
    description: 'Retrieves all menus for a portal (ADMIN or STAFF), including shared (BOTH) menus.',
  })
  @ApiParam({ name: 'portal', enum: ['ADMIN', 'STAFF', 'BOTH'], example: 'ADMIN' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menus retrieved successfully', type: [MenuResponseDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid portal value' })
  async findByPortal(@Param('portal') portal: string): Promise<StandardApiResponse<MenuResponseDto[]>> {
    return this.menuService.findByPortal(portal);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a menu by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu retrieved successfully', type: MenuResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu not found' })
  async findOne(@Param('id') id: string): Promise<StandardApiResponse<MenuResponseDto>> {
    return this.menuService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a menu', description: 'Creates a new menu row. Parent menu must exist when parentId is provided.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Menu created successfully', type: MenuResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Menu code already exists' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Parent menu not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid portal value' })
  async create(@Body() createMenuDto: CreateMenuDto): Promise<StandardApiResponse<MenuResponseDto>> {
    return this.menuService.create(createMenuDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a menu', description: 'Updates an existing menu. Send parentId as null to make it a top-level menu.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu updated successfully', type: MenuResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu or parent menu not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Menu code already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Self parent or circular hierarchy' })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto): Promise<StandardApiResponse<MenuResponseDto>> {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a menu', description: 'Deletes a menu. Blocked when the menu has children or is mapped to roles.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Menu has children or is mapped to roles' })
  async remove(@Param('id') id: string): Promise<StandardApiResponse<null>> {
    return this.menuService.remove(+id);
  }
}

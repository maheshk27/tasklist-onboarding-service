import { Controller, Get, Query, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { PerformanceLoggerService } from '../services/performance-logger.service';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { PerformanceSummary, SystemMetrics } from '../interfaces/performance.interface';

@ApiTags('Performance Monitoring')
@Controller('performance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Manager')
@UseInterceptors(ClassSerializerInterceptor)
export class PerformanceController {
  constructor(private readonly performanceLoggerService: PerformanceLoggerService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get performance summary',
    description: 'Retrieves performance metrics summary for all endpoints. Requires Admin/Manager role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', example: '/departments' },
              method: { type: 'string', example: 'GET' },
              avgResponseTime: { type: 'number', example: 150.5 },
              minResponseTime: { type: 'number', example: 50 },
              maxResponseTime: { type: 'number', example: 500 },
              totalRequests: { type: 'number', example: 100 },
              errorRate: { type: 'number', example: 2.5 },
              p95ResponseTime: { type: 'number', example: 300 },
              p99ResponseTime: { type: 'number', example: 450 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getPerformanceSummary(
    @Query('endpoint') endpoint?: string,
    @Query('method') method?: string,
  ) {
    const summary = this.performanceLoggerService.getPerformanceSummary(endpoint, method);
    return {
      success: true,
      data: summary,
    };
  }

  @Get('slowest')
  @ApiOperation({
    summary: 'Get slowest endpoints',
    description: 'Retrieves the slowest performing endpoints. Requires Admin/Manager role.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of endpoints to return (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Slowest endpoints retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', example: '/departments' },
              method: { type: 'string', example: 'GET' },
              avgResponseTime: { type: 'number', example: 1500.5 },
              minResponseTime: { type: 'number', example: 500 },
              maxResponseTime: { type: 'number', example: 5000 },
              totalRequests: { type: 'number', example: 50 },
              errorRate: { type: 'number', example: 5.0 },
              p95ResponseTime: { type: 'number', example: 3000 },
              p99ResponseTime: { type: 'number', example: 4500 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getSlowestEndpoints(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const slowest = this.performanceLoggerService.getSlowestEndpoints(limitNum);
    return {
      success: true,
      data: slowest,
    };
  }

  @Get('errors')
  @ApiOperation({
    summary: 'Get error-prone endpoints',
    description: 'Retrieves endpoints with highest error rates. Requires Admin/Manager role.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of endpoints to return (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Error-prone endpoints retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', example: '/departments' },
              method: { type: 'string', example: 'POST' },
              avgResponseTime: { type: 'number', example: 800.5 },
              minResponseTime: { type: 'number', example: 200 },
              maxResponseTime: { type: 'number', example: 2000 },
              totalRequests: { type: 'number', example: 100 },
              errorRate: { type: 'number', example: 15.5 },
              p95ResponseTime: { type: 'number', example: 1500 },
              p99ResponseTime: { type: 'number', example: 1800 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getErrorProneEndpoints(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const errorProne = this.performanceLoggerService.getErrorProneEndpoints(limitNum);
    return {
      success: true,
      data: errorProne,
    };
  }

  @Get('system')
  @ApiOperation({
    summary: 'Get system metrics',
    description: 'Retrieves current system performance metrics. Requires Admin/Manager role.',
  })
  @ApiResponse({
    status: 200,
    description: 'System metrics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            memoryUsage: {
              type: 'object',
              properties: {
                rss: { type: 'number', example: 50000000 },
                heapTotal: { type: 'number', example: 25000000 },
                heapUsed: { type: 'number', example: 15000000 },
                external: { type: 'number', example: 5000000 },
              },
            },
            uptime: { type: 'number', example: 3600 },
            activeRequests: { type: 'number', example: 5 },
            totalRequests: { type: 'number', example: 1000 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getSystemMetrics() {
    const metrics = this.performanceLoggerService.getSystemMetrics();
    return {
      success: true,
      data: metrics,
    };
  }

  @Get('export')
  @ApiOperation({
    summary: 'Export performance metrics',
    description: 'Exports all performance metrics as JSON. Requires Admin/Manager role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics exported successfully',
    content: {
      'application/json': {
        schema: {
          type: 'string',
          example: '{"requestId": "req_1234567890_abc123", "method": "GET", "endpoint": "/departments", ...}',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  exportMetrics() {
    const metrics = this.performanceLoggerService.exportMetrics();
    return metrics;
  }

  @Get('clear')
  @ApiOperation({
    summary: 'Clear performance metrics',
    description: 'Clears all stored performance metrics. Requires Admin/Manager role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics cleared successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Performance metrics cleared' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  clearMetrics() {
    this.performanceLoggerService.clearMetrics();
    return {
      success: true,
      message: 'Performance metrics cleared',
    };
  }
}
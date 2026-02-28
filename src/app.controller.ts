import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Welcome endpoint',
    description: 'Returns a welcome message for the Onboarding Service API. This endpoint does not require authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    schema: {
      type: 'string',
      example: 'Welcome to Onboarding Service API',
    },
  })
  getHello(): string {
    return 'Welcome to Onboarding Service API';
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns the health status of the application. This endpoint does not require authentication and can be used for monitoring.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'Health status of the application',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-07-15T10:30:00.000Z',
          description: 'Current timestamp',
        },
      },
    },
  })
  getHealth(): { status: string; timestamp: Date } {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }
}

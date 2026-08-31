import { Body, Controller, Post, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthService, LoginMeta } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
import { AuthResponseCodes } from './constants/auth-response-codes';
import { ApiResponse as StandardApiResponse } from '../../shared/interfaces/api-response.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register first Admin user',
    description: 'Creates the first Admin user account. This endpoint is for initial system setup only and will be closed after the first Admin is registered. This endpoint does not require authentication.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
    examples: {
      example1: {
        summary: 'User Registration Example',
        description: 'Example of user registration data',
        value: {
          userName: 'john_doe',
          password: 'password123',
          firstName: 'John',
          middleName: 'Michael',
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          mobile: '+1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'REGISTRATION_SUCCESS',
        },
        message: {
          type: 'string',
          example: 'User registered successfully',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IlVzZXIiLCJpYXQiOjE2MjYyMzA0MDJ9.sample_token',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IlVzZXIiLCJpYXQiOjE2MjYyMzA0MDIsImV4cCI6MTYyNjgzNTIwMn0.refresh_token_sample',
            },
            user: {
              type: 'object',
              properties: {
                userId: { type: 'number', example: 1 },
                userName: { type: 'string', example: 'john_doe' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                emailId: { type: 'string', example: 'john.doe@example.com' },
                role: {
                  type: 'object',
                  properties: {
                    roleId: { type: 'number', example: 1 },
                    roleName: { type: 'string', example: 'Admin' }
                  }
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'VALIDATION_ERROR' },
        message: { type: 'string', example: 'Validation failed' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USERNAME_EXISTS' },
        message: { type: 'string', example: 'Username already exists' },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<StandardApiResponse<AuthResponseDto>> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user and get access token',
    description: 'Authenticates a user with username and password, returning a JWT access token. This endpoint does not require authentication.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      example1: {
        summary: 'User Login Example',
        description: 'Example of user login credentials',
        value: {
          userName: 'john_doe',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'LOGIN_SUCCESS',
        },
        message: {
          type: 'string',
          example: 'Login successful',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IlVzZXIiLCJpYXQiOjE2MjYyMzA0MDJ9.sample_token',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IlVzZXIiLCJpYXQiOjE2MjYyMzA0MDIsImV4cCI6MTYyNjgzNTIwMn0.refresh_token_sample',
            },
            user: {
              type: 'object',
              properties: {
                userId: { type: 'number', example: 1 },
                userName: { type: 'string', example: 'john_doe' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                emailId: { type: 'string', example: 'john.doe@example.com' },
                role: {
                  type: 'object',
                  properties: {
                    roleId: { type: 'number', example: 1 },
                    roleName: { type: 'string', example: 'Admin' }
                  }
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'INVALID_CREDENTIALS' },
        message: { type: 'string', example: 'Invalid username or password' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'User details not available' },
      },
    },
  })
  async login(@Req() req: FastifyRequest, @Body() loginDto: LoginDto): Promise<StandardApiResponse<AuthResponseDto>> {
    const loginMeta: LoginMeta = {
      ipAddress: this.extractClientIpAddress(req),
      userAgent: req.headers['user-agent'] as string | undefined,
    };
    return this.authService.login(loginDto, loginMeta);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    description: 'Generates a new access token and refresh token using a valid refresh token. This endpoint does not require authentication.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token for obtaining new access tokens',
    examples: {
      example1: {
        summary: 'Refresh Token Example',
        description: 'Example of refresh token request',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IkFkbWluIiwiaWF0IjoxNjI2MjMwNDAyLCJleHAiOjE2MjY4MzUyMDJ9.refresh_token_sample',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        code: {
          type: 'string',
          example: 'REFRESH_TOKEN_SUCCESS',
        },
        message: {
          type: 'string',
          example: 'Token refreshed successfully',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IkFkbWluIiwiaWF0IjoxNjI2MjMwNDAyfQ.new_access_token',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiam9obl9kb2UiLCJyb2xlTmFtZSI6IkFkbWluIiwiaWF0IjoxNjI2MjMwNDAyLCJleHAiOjE2MjY4MzUyMDJ9.new_refresh_token',
            },
            user: {
              type: 'object',
              properties: {
                userId: { type: 'number', example: 1 },
                userName: { type: 'string', example: 'john_doe' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                emailId: { type: 'string', example: 'john.doe@example.com' },
                role: {
                  type: 'object',
                  properties: {
                    roleId: { type: 'number', example: 1 },
                    roleName: { type: 'string', example: 'Admin' }
                  }
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'REFRESH_TOKEN_INVALID' },
        message: { type: 'string', example: 'Invalid refresh token' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Expired refresh token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'REFRESH_TOKEN_EXPIRED' },
        message: { type: 'string', example: 'Refresh token has expired' },
      },
    },
  })
  async refresh(@Req() req: FastifyRequest, @Body() refreshTokenDto: RefreshTokenDto): Promise<StandardApiResponse<AuthResponseDto>> {
    const loginMeta: LoginMeta = {
      ipAddress: this.extractClientIpAddress(req),
      userAgent: req.headers['user-agent'] as string | undefined,
    };
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken, loginMeta);
  }

  /**
   * Extract the client IP address, honoring the X-Forwarded-For header
   * when the request was proxied through a reverse proxy / load balancer.
   */
  private extractClientIpAddress(req: FastifyRequest): string | undefined {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0];
    }
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
}

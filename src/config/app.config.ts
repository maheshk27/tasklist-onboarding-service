import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class AppConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  /**
   * Get application configuration
   */
  getAppConfig() {
    return {
      port: this.configService.get<number>('PORT', 3000),
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }

  /**
   * Get JWT configuration
   */
  getJwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'default_secret'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
      algorithm: this.configService.get<string>('JWT_ALGORITHM', 'HS256'),
    };
  }

  /**
   * Get database configuration based on environment
   */
  getDatabaseConfig() {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    
    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_DATABASE', `task_manager_${env}`),
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', false),
      logging: this.configService.get<boolean>('DB_LOGGING', env === 'development'),
      ssl: this.configService.get<boolean>('DB_SSL', false),
      extra: {
        ssl: {
          rejectUnauthorized: this.configService.get<boolean>('DB_SSL_REJECT_UNAUTHORIZED', false)
        }
      },
      poolSize: this.configService.get<number>('DB_POOL_MAX', env === 'production' ? 5 : 3),
      idleTimeoutMillis: this.configService.get<number>('DB_POOL_IDLE_TIMEOUT', 30000),
      connectionTimeoutMillis: this.configService.get<number>('DB_CONNECTION_TIMEOUT', 10000),
      queryTimeout: this.configService.get<number>('DB_QUERY_TIMEOUT', 30000),
      autoLoadEntities: true,
    };
  }

  /**
   * Get Redis configuration
   */
  getRedisConfig() {
    return {
      host: this.configService.get<string>('REDIS_HOST', '127.0.0.1'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD', ''),
      db: this.configService.get<number>('REDIS_DB', 0),
      url: this.configService.get<string>('REDIS_URL'),
      tls: this.configService.get<boolean>('REDIS_TLS', false)
    };
  }

  /**
   * Get file upload configuration
   */
  getUploadConfig() {
    return {
      maxFileSize: this.configService.get<number>('MAX_FILE_SIZE', 5242880),
      uploadPath: this.configService.get<string>('UPLOAD_PATH', './uploads'),
      allowedFileTypes: this.configService.get<string>('ALLOWED_FILE_TYPES', '').split(','),
    };
  }

  /**
   * Get SMTP configuration
   */
  getSmtpConfig() {
    return {
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASS'),
      fromEmail: this.configService.get<string>('FROM_EMAIL', 'noreply@example.com'),
    };
  }

  /**
   * Validate required environment variables
   */
  validateConfig() {
    const required = [
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'JWT_SECRET',
    ];

    const missing = required.filter(key => !this.configService.get(key));
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate JWT secret length for production
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    
    if (nodeEnv === 'production' && jwtSecret && jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long in production');
    }
  }

  /**
   * TypeOrmOptionsFactory implementation
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Validate configuration before connecting
    this.validateConfig();
    const dbConfig = this.getDatabaseConfig();
    return dbConfig as TypeOrmModuleOptions;
  }
}
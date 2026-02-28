import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseConfig.name);

  constructor(private configService: ConfigService) {}

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
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', env === 'development'),
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
   * Get database URL if provided (alternative to individual settings)
   */
  getDatabaseUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
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
   * Get application configuration
   */
  getAppConfig() {
    return {
      port: this.configService.get<number>('PORT', 3000),
      host: this.configService.get<string>('HOST', 'localhost'),
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }

  /**
   * Get logging configuration
   */
  getLoggingConfig() {
    return {
      level: this.configService.get<string>('LOG_LEVEL', 'info'),
      file: this.configService.get<string>('LOG_FILE'),
      maxSize: this.configService.get<string>('LOG_MAX_SIZE', '10m'),
      maxFiles: this.configService.get<number>('LOG_MAX_FILES', 5),
      toConsole: this.configService.get<boolean>('LOG_TO_CONSOLE', true),
    };
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return {
      corsOrigin: this.configService.get<string>('CORS_ORIGIN', '*').split(','),
      corsCredentials: this.configService.get<boolean>('CORS_CREDENTIALS', true),
      rateLimitWindowMs: this.configService.get<number>('RATE_LIMIT_WINDOW_MS', 900000),
      rateLimitMaxRequests: this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS', 100),
      enableHelmet: this.configService.get<boolean>('ENABLE_HELMET', true),
      enableCSP: this.configService.get<boolean>('ENABLE_CSP', true),
      enableHSTS: this.configService.get<boolean>('ENABLE_HSTS', true),
    };
  }

  /**
   * Get feature flags
   */
  getFeatureFlags() {
    return {
      debugMode: this.configService.get<boolean>('ENABLE_DEBUG_MODE', false),
      swagger: this.configService.get<boolean>('ENABLE_SWAGGER', true),
      cors: this.configService.get<boolean>('ENABLE_CORS', true),
      rateLimiting: this.configService.get<boolean>('ENABLE_RATE_LIMITING', false),
      metrics: this.configService.get<boolean>('ENABLE_METRICS', false),
      tracing: this.configService.get<boolean>('ENABLE_TRACING', false),
    };
  }

  /**
   * Get external services configuration
   */
  getExternalServicesConfig() {
    return {
      emailService: {
        apiKey: this.configService.get<string>('EMAIL_SERVICE_API_KEY'),
        url: this.configService.get<string>('EMAIL_SERVICE_URL'),
      },
      notificationService: {
        url: this.configService.get<string>('NOTIFICATION_SERVICE_URL'),
      },
      slack: {
        webhookUrl: this.configService.get<string>('SLACK_WEBHOOK_URL'),
      },
      googleAnalytics: {
        id: this.configService.get<string>('GOOGLE_ANALYTICS_ID'),
      },
      sentry: {
        dsn: this.configService.get<string>('SENTRY_DSN'),
      },
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
   * Get cache configuration
   */
  getCacheConfig() {
    return {
      ttl: this.configService.get<number>('CACHE_TTL', 3600),
      maxSize: this.configService.get<number>('CACHE_MAX_SIZE', 100),
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
   * Get health check configuration
   */
  getHealthCheckConfig() {
    return {
      path: this.configService.get<string>('HEALTH_CHECK_PATH', '/health'),
      timeout: this.configService.get<number>('HEALTH_CHECK_TIMEOUT', 5000),
    };
  }

  /**
   * Get monitoring configuration
   */
  getMonitoringConfig() {
    return {
      metricsPort: this.configService.get<number>('METRICS_PORT', 9090),
      jaegerEndpoint: this.configService.get<string>('JAEGER_ENDPOINT'),
      prometheusEndpoint: this.configService.get<string>('PROMETHEUS_ENDPOINT'),
    };
  }

  /**
   * Get backup configuration
   */
  getBackupConfig() {
    return {
      enabled: this.configService.get<boolean>('BACKUP_ENABLED', false),
      schedule: this.configService.get<string>('BACKUP_SCHEDULE', '0 2 * * *'),
      retentionDays: this.configService.get<number>('BACKUP_RETENTION_DAYS', 7),
    };
  }

  /**
   * Get SSL/TLS configuration
   */
  getSslConfig() {
    return {
      certPath: this.configService.get<string>('SSL_CERT_PATH'),
      keyPath: this.configService.get<string>('SSL_KEY_PATH'),
      caPath: this.configService.get<string>('SSL_CA_PATH'),
    };
  }

  /**
   * Get session configuration
   */
  getSessionConfig() {
    return {
      secret: this.configService.get<string>('SESSION_SECRET'),
      timeout: this.configService.get<number>('SESSION_TIMEOUT', 86400000),
    };
  }

  /**
   * Get API rate limiting configuration
   */
  getApiRateLimitConfig() {
    return {
      windowMs: this.configService.get<number>('API_RATE_LIMIT_WINDOW', 60000),
      max: this.configService.get<number>('API_RATE_LIMIT_MAX', 1000),
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
    const dbUrl = this.getDatabaseUrl();
    
    // Log database configuration for debugging
    // this.logDatabaseConfig(dbConfig, dbUrl);
    
    // Use DATABASE_URL if provided, otherwise use individual settings
    if (dbUrl) {
      return {
        ...dbConfig,
        url: dbUrl,
      } as TypeOrmModuleOptions;
    }
    
    return dbConfig as TypeOrmModuleOptions;
  }

  /**
   * Log database configuration values for debugging
   */
  private logDatabaseConfig(dbConfig: any, dbUrl?: string) {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    
    this.logger.log(`Database Configuration for ${nodeEnv.toUpperCase()}:`);
    this.logger.log(`========================================`);
    this.logger.log(`Host: ${dbConfig.host}`);
    this.logger.log(`Port: ${dbConfig.port}`);
    this.logger.log(`Username: ${dbConfig.username}`);
    this.logger.log(`Database: ${dbConfig.database}`);
    this.logger.log(`Password: ${'*'.repeat(dbConfig.password?.length || 0)}`); // Mask password
    this.logger.log(`SSL Enabled: ${dbConfig.ssl}`);
    this.logger.log(`SSL Reject Unauthorized: ${dbConfig.extra?.ssl?.rejectUnauthorized}`);
    this.logger.log(`Synchronize: ${dbConfig.synchronize}`);
    this.logger.log(`Logging: ${dbConfig.logging}`);
    this.logger.log(`Pool Size: ${dbConfig.poolSize}`);
    this.logger.log(`Connection Timeout: ${dbConfig.connectionTimeoutMillis}ms`);
    this.logger.log(`Query Timeout: ${dbConfig.queryTimeout}ms`);
    this.logger.log(`Idle Timeout: ${dbConfig.idleTimeoutMillis}ms`);
    
    if (dbUrl) {
      this.logger.log(`DATABASE_URL: ${dbUrl}`);
    }
    
    this.logger.log(`========================================`);
  }
}
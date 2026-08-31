# Environment Configuration Setup

This document explains how to set up environment-specific configurations for the onboarding-service.

## Overview

The onboarding-service supports multiple environment configurations through `.env` files. The application automatically loads the appropriate configuration based on the `NODE_ENV` environment variable.

## Environment Files

### 1. `.env.example` (Template)
- Contains example configuration values
- Should be used as a template for creating environment-specific files
- **This file is committed to version control**

### 2. `.env.development` (Development)
- Configuration for local development
- Includes debug settings, local database connections, and development features
- **This file is ignored by git**

### 3. `.env.staging` (Staging)
- Configuration for staging environment
- Mirrors production settings with some development-friendly features
- **This file is ignored by git**

### 4. `.env.production` (Production)
- Configuration for production environment
- Includes security settings, performance optimizations, and monitoring
- **This file is ignored by git**

### 5. `.env.test` (Testing)
- Configuration for automated tests
- Uses test database and mock services
- **This file is ignored by git**

## Configuration Loading Priority

The application loads configuration files in the following order:

1. `.env` (local overrides)
2. `.env.{NODE_ENV}` (environment-specific)
3. `.env.local` (local development overrides)
4. Environment variables from the system

Later files override earlier ones, allowing for flexible configuration management.

## Key Configuration Sections

### Database Configuration

```bash
# Basic database settings
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=task_manager_dev

# SSL settings
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Connection pooling
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=30000

# Alternative: Use DATABASE_URL
DATABASE_URL=postgresql://user:pass@host:port/db
```

### JWT Configuration

```bash
# JWT settings
JWT_SECRET=your_jwt_secret_key_here
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=168h
JWT_ALGORITHM=HS256
```

> **Note:** `JWT_ACCESS_EXPIRES_IN` controls the lifespan of access tokens and
> `JWT_REFRESH_EXPIRES_IN` controls refresh tokens. For backward compatibility,
> the legacy `JWT_EXPIRES_IN` variable is still honoured as a fallback when the
> more specific variables are not set.

### Redis Configuration

```bash
# Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
REDIS_URL=redis://localhost:6379
```

### Security Configuration

```bash
# CORS settings
CORS_ORIGIN=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security headers
ENABLE_HELMET=true
ENABLE_CSP=true
ENABLE_HSTS=true
```

### Logging Configuration

```bash
# Log settings
LOG_LEVEL=debug
LOG_FILE=logs/development.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5
LOG_TO_CONSOLE=true
```

### External Services

```bash
# Email service
EMAIL_SERVICE_API_KEY=your_email_api_key
EMAIL_SERVICE_URL=https://api.emailservice.com

# SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yourapp.com
```

## Environment-Specific Features

### Development Environment
- **Debug mode enabled**
- **Database synchronization enabled**
- **Detailed logging**
- **Swagger documentation enabled**
- **Hot reloading**

### Staging Environment
- **Production-like settings**
- **Monitoring enabled**
- **Limited debug features**
- **SSL required**

### Production Environment
- **Security hardened**
- **Performance optimized**
- **Monitoring and tracing**
- **SSL required**
- **No debug features**

### Test Environment
- **Test database**
- **Mock services**
- **Fast execution**
- **Seed data generation**

## Usage Examples

### Development

```bash
# Set environment
export NODE_ENV=development

# Start application
npm run start:dev

# The application will load .env.development
```

### Staging

```bash
# Set environment
export NODE_ENV=staging

# Start application
npm run start:prod

# The application will load .env.staging
```

### Production

```bash
# Set environment
export NODE_ENV=production

# Start application
npm run start:prod

# The application will load .env.production
```

### Testing

```bash
# Set environment
export NODE_ENV=test

# Run tests
npm run test

# The application will load .env.test
```

## Configuration Validation

The application validates required environment variables at startup:

- `DB_HOST`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`
- `JWT_SECRET`

In production, additional validation ensures:
- JWT secret is at least 32 characters long
- SSL is enabled for database connections

## Creating New Environment Files

1. Copy the `.env.example` file:
   ```bash
   cp .env.example .env.your_environment
   ```

2. Update the configuration values for your environment

3. Set the `NODE_ENV` variable to your environment name

4. Test the configuration:
   ```bash
   NODE_ENV=your_environment npm run start:dev
   ```

## Security Best Practices

1. **Never commit sensitive data** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable SSL** in staging and production
4. **Use environment variables** for secrets in production
5. **Regularly rotate secrets** and credentials
6. **Monitor configuration changes** in production

## Troubleshooting

### Configuration Not Loading

1. Check that `NODE_ENV` is set correctly
2. Verify the `.env` file exists and is readable
3. Check file permissions
4. Review the application logs for configuration errors

### Database Connection Issues

1. Verify database credentials in the `.env` file
2. Check database server accessibility
3. Ensure SSL settings match your database configuration
4. Review connection pool settings

### JWT Authentication Issues

1. Verify `JWT_SECRET` is set and consistent across services
2. Check token expiration settings
3. Ensure JWT algorithm matches your requirements

## Docker Support

For Docker deployments, you can pass environment variables:

```bash
docker run -e NODE_ENV=production \
           -e DB_HOST=your-db-host \
           -e JWT_SECRET=your-secret \
           your-app-image
```

Or use environment files:

```bash
docker run --env-file .env.production your-app-image
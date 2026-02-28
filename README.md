# Onboarding Service

A NestJS-based microservice for user onboarding and authentication, built with Fastify and integrated with the database-core package.

## Features

- **NestJS Framework**: Built with NestJS for scalable and maintainable architecture
- **Fastify Integration**: High-performance HTTP server with Fastify
- **Swagger Documentation**: Complete API documentation with Swagger UI
- **TypeORM Integration**: Database ORM with PostgreSQL support
- **JWT Authentication**: Secure authentication with JSON Web Tokens
- **Database Core Integration**: Consumes the task-manager-database-core npm package
- **Validation**: Input validation with class-validator
- **Environment Configuration**: Environment-based configuration management

## Prerequisites

- Node.js (version 16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   cd onboarding-service
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

## Configuration

Create a `.env` file based on `.env.example`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=task_manager
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Application Configuration
PORT=9000
NODE_ENV=development
```

## Running the Service

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Testing
```bash
npm run test
npm run test:watch
npm run test:cov
```

## API Endpoints

### Authentication

- **POST** `/auth/register` - User registration
- **POST** `/auth/login` - User authentication

### Users

- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get user by ID
- **POST** `/users` - Create new user
- **PUT** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

### Health Check

- **GET** `/health` - Health check endpoint

## Swagger Documentation

Access the API documentation at:
```
http://localhost:3000/api
```

## Database Integration

The service integrates with the `task-manager-database-core` package which provides:

- **Entities**: User, Role, Store, TaskMaster, StoreTask, TaskChecklist, TaskChecklistExecution, TaskExecution, UserDevice, UserStore
- **Enums**: Various status and type enums
- **Base Interfaces**: BaseEntity with createdAt and updatedAt timestamps

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── app.controller.ts          # Root controller
├── app.service.ts             # Root service
├── main.ts                    # Application entry point
├── config/                    # Configuration files
├── modules/                   # Feature modules
│   ├── auth/                  # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── dto/               # Authentication DTOs
│   └── user/                  # User management module
│       ├── user.module.ts
│       ├── user.service.ts
│       ├── user.controller.ts
│       └── dto/               # User DTOs
└── shared/                    # Shared modules and utilities
    ├── database/              # Database configuration
    └── interceptors/          # Custom interceptors
```

## Dependencies

### Core Dependencies
- `@nestjs/core` - NestJS core framework
- `@nestjs/platform-fastify` - Fastify integration
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/swagger` - Swagger documentation
- `task-manager-database-core` - Database entities and enums

### Development Dependencies
- `@nestjs/cli` - NestJS CLI tools
- `@nestjs/schematics` - NestJS code generation
- `jest` - Testing framework
- `typescript` - TypeScript compiler

## License

MIT License
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PerformanceInterceptor } from './shared/interceptors/performance.interceptor';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Configure CORS
  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) || ['http://localhost:5173'];
  
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Apply performance monitoring interceptor globally
  app.useGlobalInterceptors(new PerformanceInterceptor());

  // Get configuration service
  const appConfigService = app.get(AppConfig);
  const appConfig = appConfigService.getAppConfig();
  const port = appConfig.port;

  const config = new DocumentBuilder()
    .setTitle('Onboarding Service API')
    .setDescription('Comprehensive API documentation for user onboarding and management')
    .setVersion('1.0.0')
    .addTag('Auth', 'Authentication and user registration (No authorization required)')
    .addTag('Users', 'User management operations (Authorization required)')
    .addTag('Health', 'System health and status (No authorization required)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AppModule],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Onboarding Service API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin-bottom: 20px }
        .swagger-ui .scheme-container { background: #f7f7f7; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
      `
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
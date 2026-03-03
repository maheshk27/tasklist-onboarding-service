import { Module } from '@nestjs/common';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { PerformanceLoggerService } from '../services/performance-logger.service';
import { PerformanceController } from '../controllers/performance.controller';
import { AppConfig } from '../../config/app.config';

@Module({
  providers: [
    PerformanceInterceptor,
    PerformanceLoggerService,
    AppConfig,
  ],
  controllers: [PerformanceController],
  exports: [
    PerformanceInterceptor,
    PerformanceLoggerService,
    AppConfig,
  ],
})
export class PerformanceModule {}

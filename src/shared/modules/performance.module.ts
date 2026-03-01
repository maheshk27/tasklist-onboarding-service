import { Module } from '@nestjs/common';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { PerformanceLoggerService } from '../services/performance-logger.service';
import { PerformanceController } from '../controllers/performance.controller';

@Module({
  providers: [
    PerformanceInterceptor,
    PerformanceLoggerService,
  ],
  controllers: [PerformanceController],
  exports: [
    PerformanceInterceptor,
    PerformanceLoggerService,
  ],
})
export class PerformanceModule {}
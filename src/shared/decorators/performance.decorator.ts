import { SetMetadata } from '@nestjs/common';

export const PERFORMANCE_THRESHOLD = 'performance_threshold';
export const PERFORMANCE_ENABLED = 'performance_enabled';

/**
 * Decorator to enable detailed performance monitoring for specific endpoints
 * @param threshold - Response time threshold in milliseconds (default: 1000ms)
 */
export const PerformanceMonitor = (threshold: number = 1000) => {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    // Enable performance monitoring for this method
    SetMetadata(PERFORMANCE_ENABLED, true)(target, propertyKey, descriptor);
    
    // Set custom threshold if provided
    if (threshold > 0) {
      SetMetadata(PERFORMANCE_THRESHOLD, threshold)(target, propertyKey, descriptor);
    }
  };
};

/**
 * Decorator to disable performance monitoring for specific endpoints
 */
export const DisablePerformanceMonitor = () => {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata(PERFORMANCE_ENABLED, false)(target, propertyKey, descriptor);
  };
};
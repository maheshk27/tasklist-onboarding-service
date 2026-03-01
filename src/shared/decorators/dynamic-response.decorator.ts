import { SetMetadata } from '@nestjs/common';
import { ApiResponseMetadata } from '@nestjs/swagger';

/**
 * Decorator to dynamically set HTTP status codes based on response content
 * This decorator should be used in combination with @HttpCode(HttpStatus.OK) 
 * to allow the actual status code to be determined at runtime
 */
export const DYNAMIC_RESPONSE_KEY = 'dynamic_response';

export interface DynamicResponseOptions {
  /**
   * Whether to use the statusCode field from the response object
   * If false, will use the static @HttpCode decorator value
   */
  useDynamicStatus?: boolean;
  
  /**
   * Default status code to use if dynamic status is not available
   */
  defaultStatus?: number;
}

/**
 * Decorator to enable dynamic HTTP status code setting
 * Use this decorator on controller methods that return ApiResponse objects
 */
export const DynamicResponse = (options: DynamicResponseOptions = { useDynamicStatus: true, defaultStatus: 200 }) =>
  SetMetadata(DYNAMIC_RESPONSE_KEY, options);

/**
 * Helper function to get dynamic response options from a method
 */
export function getDynamicResponseOptions(target: any, propertyKey: string): DynamicResponseOptions | undefined {
  return Reflect.getMetadata(DYNAMIC_RESPONSE_KEY, target, propertyKey);
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { DYNAMIC_RESPONSE_KEY, DynamicResponseOptions, getDynamicResponseOptions } from '../decorators/dynamic-response.decorator';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class DynamicResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<DynamicResponseOptions>(DYNAMIC_RESPONSE_KEY, context.getHandler()) || 
                   getDynamicResponseOptions(context.getClass(), context.getHandler().name);

    const useDynamicStatus = options?.useDynamicStatus ?? true;
    const defaultStatus = options?.defaultStatus ?? HttpStatus.OK;

    return next.handle().pipe(
      map((response: ApiResponse<any>) => {
        if (useDynamicStatus && response && typeof response === 'object' && response.statusCode) {
          // Set the HTTP status code based on the response object
          const statusCode = response.statusCode;
          
          // Set the status code on the response object
          const httpContext = context.switchToHttp();
          const responseObj = httpContext.getResponse();
          responseObj.status(statusCode);
        }
        
        // Add performance timing to response headers if available
        const request = context.switchToHttp().getRequest();
        if (request.requestId) {
          const responseObj = context.switchToHttp().getResponse();
          
          // Fastify uses different API than Express
          if (responseObj.setHeader) {
            // Express compatibility
            responseObj.setHeader('X-Request-ID', request.requestId);
          } else if (responseObj.header) {
            // Fastify compatibility
            responseObj.header('X-Request-ID', request.requestId);
          }
          
          // Add timing information if available (from performance interceptor)
          if (request.startTime) {
            const responseTime = Date.now() - request.startTime;
            
            if (responseObj.setHeader) {
              // Express compatibility
              responseObj.setHeader('X-Response-Time', `${responseTime}ms`);
            } else if (responseObj.header) {
              // Fastify compatibility
              responseObj.header('X-Response-Time', `${responseTime}ms`);
            }
          }
        }
        
        // Return the response as is
        return response;
      })
    );
  }
}

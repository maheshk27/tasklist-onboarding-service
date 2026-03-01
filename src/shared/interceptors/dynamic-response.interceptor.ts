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
        
        // Return the response as is
        return response;
      })
    );
  }
}

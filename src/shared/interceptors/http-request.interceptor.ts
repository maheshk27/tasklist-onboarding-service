import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { extractUserIdFromToken } from '../utils/jwt-helper';

@Injectable()
export class HttpRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip } = request;
    const userId = extractUserIdFromToken(request);

    // Generate request ID (reused by PerformanceInterceptor for correlation)
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    request.requestId = requestId;

    // Add request ID to response headers for client correlation
    response.setHeader?.('X-Request-ID', requestId);
    response.header?.('X-Request-ID', requestId);

    // Log incoming request
    this.logger.log(
      `→ INCOMING REQUEST | ${requestId} | userId:${userId ?? 'anonymous'} | ${method} | ${url} | IP: ${ip}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const executionTime = Date.now() - startTime;
          const { statusCode } = response;
          const contentLength = response.getHeader?.('content-length') || response.getHeader('content-length') || 0;

          const logMessage =
            `← RESPONSE | ${requestId} | userId:${userId ?? 'anonymous'} | ${method} | ${url} | Status: ${statusCode} | ${executionTime}ms | Size: ${contentLength} bytes`;

          if (statusCode >= 500) {
            this.logger.error(logMessage);
          } else if (statusCode >= 400) {
            this.logger.warn(logMessage);
          } else {
            this.logger.log(logMessage);
          }
        },
        error: (error) => {
          const executionTime = Date.now() - startTime;
          const statusCode = error.status || 500;

          const logMessage =
            `← RESPONSE | ${requestId} | userId:${userId ?? 'anonymous'} | ${method} | ${url} | Status: ${statusCode} | ${executionTime}ms | Error: ${error.message}`;

          this.logger.error(logMessage);
        }
      })
    );
  }
}

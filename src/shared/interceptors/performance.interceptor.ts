import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface PerformanceLogData {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip?: string;
  timestamp: string;
}

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Generate or get request ID
    const requestId = this.generateRequestId();
    request.requestId = requestId;

    // Add request ID to response headers for client correlation
    // Fastify uses different API than Express
    if (response.setHeader) {
      // Express compatibility
      response.setHeader('X-Request-ID', requestId);
    } else if (response.header) {
      // Fastify compatibility
      response.header('X-Request-ID', requestId);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          const logData: PerformanceLogData = {
            requestId,
            method: request.method,
            url: request.url,
            statusCode: response.statusCode || response.status,
            responseTime,
            ip: request.ip || request.connection?.remoteAddress,
            timestamp: new Date().toISOString(),
          };

          this.logPerformance(logData);
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          const logData: PerformanceLogData = {
            requestId,
            method: request.method,
            url: request.url,
            statusCode: error.status || 500,
            responseTime,
            ip: request.ip || request.connection?.remoteAddress,
            timestamp: new Date().toISOString(),
          };

          this.logPerformance(logData, true, error.message);
        }
      })
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logPerformance(logData: PerformanceLogData, isError = false, errorMessage?: string): void {
    const { requestId, method, url, statusCode, responseTime, userAgent, ip, timestamp } = logData;
    
    // Determine log level based on response time
    let logLevel: 'log' | 'warn' | 'error' = 'log';
    let performanceLevel = 'NORMAL';

    if (responseTime > 5000) {
      logLevel = 'error';
      performanceLevel = 'CRITICAL';
    } else if (responseTime > 2000) {
      logLevel = 'warn';
      performanceLevel = 'SLOW';
    } else if (responseTime > 1000) {
      logLevel = 'warn';
      performanceLevel = 'MODERATE';
    }

    const logMessage = isError 
      ? `Performance Alert [${performanceLevel}] - ${method} ${url} - ${statusCode} - ${responseTime}ms - ${errorMessage}`
      : `Performance [${performanceLevel}] - ${method} ${url} - ${statusCode} - ${responseTime}ms`;

    const logContext = {
      requestId,
      method,
      url,
      statusCode,
      responseTime,
      performanceLevel,
      ip,
      timestamp,
      ...(isError && { errorMessage }),
    };

    // Use appropriate log level
    switch (logLevel) {
      case 'error':
        this.logger.error(logMessage, JSON.stringify(logContext));
        break;
      case 'warn':
        this.logger.warn(logMessage, JSON.stringify(logContext));
        break;
      // default:
      //   this.logger.log(logMessage, JSON.stringify(logContext));
    }

    // Log slow requests to a separate file or monitoring system
    if (responseTime > 2000) {
      this.logger.warn(`SLOW REQUEST DETECTED: ${JSON.stringify(logContext)}`);
    }
  }
}
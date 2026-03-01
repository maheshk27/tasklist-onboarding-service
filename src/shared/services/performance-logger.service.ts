import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceMetrics, PerformanceSummary } from '../interfaces/performance.interface';

@Injectable()
export class PerformanceLoggerService {
  private readonly logger = new Logger(PerformanceLoggerService.name);
  private readonly metrics: PerformanceMetrics[] = [];
  private readonly maxMetricsHistory = 10000; // Keep last 10k requests in memory

  constructor() {}

  /**
   * Log performance metrics for a request
   */
  logRequest(metrics: PerformanceMetrics): void {
    // Add current memory usage
    const memoryUsage = process.memoryUsage();
    
    const enrichedMetrics: PerformanceMetrics = {
      ...metrics,
      memoryUsage,
      timestamp: new Date(),
    };

    // Store in memory for aggregation
    this.metrics.push(enrichedMetrics);

    // Maintain memory limits
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics.shift();
    }

    // Log to console with structured format
    this.logger.log(this.formatLogMessage(enrichedMetrics), this.getLogLevel(enrichedMetrics.responseTime));

    // Log slow requests separately
    if (enrichedMetrics.responseTime > 2000) {
      this.logger.warn(`SLOW REQUEST: ${this.formatLogMessage(enrichedMetrics)}`);
    }

    // Log critical performance issues
    if (enrichedMetrics.responseTime > 5000) {
      this.logger.error(`CRITICAL PERFORMANCE: ${this.formatLogMessage(enrichedMetrics)}`);
    }
  }

  /**
   * Get performance summary for an endpoint
   */
  getPerformanceSummary(endpoint?: string, method?: string): PerformanceSummary[] {
    let filteredMetrics = this.metrics;

    if (endpoint) {
      filteredMetrics = filteredMetrics.filter(m => m.endpoint === endpoint);
    }

    if (method) {
      filteredMetrics = filteredMetrics.filter(m => m.method === method);
    }

    // Group by endpoint and method
    const grouped = new Map<string, PerformanceMetrics[]>();
    
    filteredMetrics.forEach(metric => {
      const key = `${metric.method}:${metric.endpoint}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(metric);
    });

    // Calculate summary for each group
    const summaries: PerformanceSummary[] = [];
    
    grouped.forEach((metrics, key) => {
      const [method, endpoint] = key.split(':');
      const responseTimes = metrics.map(m => m.responseTime).sort((a, b) => a - b);
      const totalRequests = metrics.length;
      const errorRequests = metrics.filter(m => m.statusCode >= 400).length;
      const errorRate = (errorRequests / totalRequests) * 100;

      summaries.push({
        endpoint,
        method,
        avgResponseTime: this.calculateAverage(responseTimes),
        minResponseTime: responseTimes[0],
        maxResponseTime: responseTimes[responseTimes.length - 1],
        totalRequests,
        errorRate,
        p95ResponseTime: this.calculatePercentile(responseTimes, 95),
        p99ResponseTime: this.calculatePercentile(responseTimes, 99),
      });
    });

    return summaries.sort((a, b) => b.avgResponseTime - a.avgResponseTime);
  }

  /**
   * Get slowest endpoints
   */
  getSlowestEndpoints(limit = 10): PerformanceSummary[] {
    return this.getPerformanceSummary()
      .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
      .slice(0, limit);
  }

  /**
   * Get error-prone endpoints
   */
  getErrorProneEndpoints(limit = 10): PerformanceSummary[] {
    return this.getPerformanceSummary()
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, limit);
  }

  /**
   * Get current system metrics
   */
  getSystemMetrics(): {
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
    activeRequests: number;
    totalRequests: number;
  } {
    return {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      activeRequests: this.metrics.filter(m => m.timestamp.getTime() > Date.now() - 60000).length,
      totalRequests: this.metrics.length,
    };
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics.length = 0;
    this.logger.log('Performance metrics cleared');
  }

  /**
   * Export metrics to JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  private formatLogMessage(metrics: PerformanceMetrics): string {
    const { requestId, method, endpoint, statusCode, responseTime, timestamp, userAgent, ip, userId, error } = metrics;
    
    const parts = [
      `REQ_ID=${requestId}`,
      `METHOD=${method}`,
      `ENDPOINT=${endpoint}`,
      `STATUS=${statusCode}`,
      `TIME=${responseTime}ms`,
      `TS=${timestamp.toISOString()}`,
    ];

    if (userAgent) parts.push(`UA=${userAgent.substring(0, 50)}...`);
    if (ip) parts.push(`IP=${ip}`);
    if (userId) parts.push(`USER=${userId}`);
    if (error) parts.push(`ERROR=${error}`);

    return parts.join(' | ');
  }

  private getLogLevel(responseTime: number): 'log' | 'warn' | 'error' {
    if (responseTime > 5000) return 'error';
    if (responseTime > 2000) return 'warn';
    return 'log';
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  private calculatePercentile(sortedNumbers: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedNumbers.length) - 1;
    return sortedNumbers[Math.max(0, Math.min(index, sortedNumbers.length - 1))];
  }
}
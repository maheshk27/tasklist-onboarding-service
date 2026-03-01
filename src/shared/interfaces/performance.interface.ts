export interface PerformanceMetrics {
  requestId: string;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  memoryUsage?: NodeJS.MemoryUsage;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  userId?: number;
  error?: string;
}

export interface PerformanceSummary {
  endpoint: string;
  method: string;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalRequests: number;
  errorRate: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

export interface SystemMetrics {
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
  activeRequests: number;
  totalRequests: number;
}
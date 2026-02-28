import { ApiResponse, ApiError, PaginationMeta } from '../interfaces/api-response.interface';

export class ResponseBuilder {
  /**
   * Build a successful response
   */
  static success<T>(
    data: T, 
    responseCode: { code: string; message: string } = { 
      code: 'SUCCESS', 
      message: 'Operation completed successfully' 
    },
    meta?: PaginationMeta
  ): ApiResponse<T> {
    return {
      success: true,
      code: responseCode.code,
      message: responseCode.message,
      data,
      meta
    };
  }

  /**
   * Build an error response
   */
  static error(
    responseCode: { code: string; message: string },
    errors?: ApiError[]
  ): ApiResponse<null> {
    return {
      success: false,
      code: responseCode.code,
      message: responseCode.message,
      data: null,
      errors
    };
  }

  /**
   * Build a not found response
   */
  static notFound(
    resource: string = 'Resource',
    customMessage?: string
  ): ApiResponse<null> {
    const message = customMessage || `${resource} not found`;
    return this.error({
      code: 'NOT_FOUND',
      message
    });
  }

  /**
   * Build a validation error response
   */
  static validationError(
    errors: ApiError[],
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'VALIDATION_ERROR',
      message: customMessage || 'Validation failed'
    }, errors);
  }

  /**
   * Build a conflict response
   */
  static conflict(
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'CONFLICT',
      message: customMessage || 'Resource already exists'
    });
  }

  /**
   * Build an unauthorized response
   */
  static unauthorized(
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'UNAUTHORIZED',
      message: customMessage || 'Authentication required'
    });
  }

  /**
   * Build a forbidden response
   */
  static forbidden(
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'FORBIDDEN',
      message: customMessage || 'Access denied'
    });
  }

  /**
   * Build an internal error response
   */
  static internalError(
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'INTERNAL_ERROR',
      message: customMessage || 'Internal server error'
    });
  }

  /**
   * Build a bad request response
   */
  static badRequest(
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'BAD_REQUEST',
      message: customMessage || 'Bad request'
    });
  }

  /**
   * Build a service unavailable response
   */
  static serviceUnavailable(
    customMessage?: string
  ): ApiResponse<null> {
    return this.error({
      code: 'SERVICE_UNAVAILABLE',
      message: customMessage || 'Service temporarily unavailable'
    });
  }

  /**
   * Build a paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    responseCode: { code: string; message: string } = { 
      code: 'SUCCESS', 
      message: 'Operation completed successfully' 
    }
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages
    };

    return this.success(data, responseCode, meta);
  }
}
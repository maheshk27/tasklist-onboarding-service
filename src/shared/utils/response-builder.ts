import { ApiResponse, ApiError, PaginationMeta } from '../interfaces/api-response.interface';
import { BaseResponseCodes } from '../constants/response-codes';

export class ResponseBuilder {
  /**
   * Build a successful response
   */
  static success<T>(
    data: T, 
    responseCode: { code: string; message: string; statusCode?: number } = { 
      code: 'SUCCESS', 
      message: 'Operation completed successfully',
      statusCode: BaseResponseCodes.SUCCESS.statusCode
    },
    meta?: PaginationMeta
  ): ApiResponse<T> {
    const statusCode = responseCode.statusCode || BaseResponseCodes.SUCCESS.statusCode;
    
    return {
      success: true,
      code: responseCode.code,
      message: responseCode.message,
      data,
      meta,
      statusCode
    };
  }

  /**
   * Build an error response
   */
  static error(
    responseCode: { code: string; message: string; statusCode?: number },
    errors?: ApiError[]
  ): ApiResponse<null> {
    const statusCode = responseCode.statusCode || BaseResponseCodes.INTERNAL_ERROR.statusCode;
    
    return {
      success: false,
      code: responseCode.code,
      message: responseCode.message,
      data: null,
      errors,
      statusCode
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
      message,
      statusCode: BaseResponseCodes.NOT_FOUND.statusCode
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
      message: customMessage || 'Validation failed',
      statusCode: BaseResponseCodes.VALIDATION_ERROR.statusCode
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
      message: customMessage || 'Resource already exists',
      statusCode: BaseResponseCodes.CONFLICT.statusCode
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
      message: customMessage || 'Authentication required',
      statusCode: BaseResponseCodes.UNAUTHORIZED.statusCode
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
      message: customMessage || 'Access denied',
      statusCode: BaseResponseCodes.FORBIDDEN.statusCode
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
      message: customMessage || 'Internal server error',
      statusCode: BaseResponseCodes.INTERNAL_ERROR.statusCode
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
      message: customMessage || 'Bad request',
      statusCode: BaseResponseCodes.BAD_REQUEST.statusCode
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
      message: customMessage || 'Service temporarily unavailable',
      statusCode: BaseResponseCodes.SERVICE_UNAVAILABLE.statusCode
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

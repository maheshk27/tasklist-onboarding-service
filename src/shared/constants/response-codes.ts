export const BaseResponseCodes = {
  SUCCESS: {
    code: 'SUCCESS',
    message: 'Operation completed successfully'
  },
  CREATED: {
    code: 'CREATED',
    message: 'Resource created successfully'
  },
  UPDATED: {
    code: 'UPDATED',
    message: 'Resource updated successfully'
  },
  DELETED: {
    code: 'DELETED',
    message: 'Resource deleted successfully'
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed'
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found'
  },
  CONFLICT: {
    code: 'CONFLICT',
    message: 'Resource already exists'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required'
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Access denied'
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Internal server error'
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'Bad request'
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service temporarily unavailable'
  }
};
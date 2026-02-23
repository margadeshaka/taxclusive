export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network request failed", statusCode: number = 503, details?: any) {
    super(message, statusCode, "NETWORK_ERROR", details);
    this.name = "NetworkError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

// Error handler utility
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
} {
  // Handle known AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      details: context ? { ...error.details, context } : error.details,
    };
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as any;
    
    if (prismaError.code === "P2002") {
      return {
        message: "A record with this value already exists",
        statusCode: 409,
        code: "DUPLICATE_ENTRY",
        details: context,
      };
    }
    
    if (prismaError.code === "P2025") {
      return {
        message: "Record not found",
        statusCode: 404,
        code: "NOT_FOUND",
        details: context,
      };
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
      code: "INTERNAL_ERROR",
      details: context,
    };
  }

  // Handle unknown errors
  return {
    message: "An unexpected error occurred",
    statusCode: 500,
    code: "UNKNOWN_ERROR",
    details: context,
  };
}

// Async error wrapper for route handlers
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      const errorInfo = handleError(error);
      throw new AppError(
        errorInfo.message,
        errorInfo.statusCode,
        errorInfo.code,
        errorInfo.details
      );
    }
  }) as T;
}

export async function withErrorHandling<T>(
  promise: Promise<T>,
  context?: Record<string, unknown>
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    handleError(error, context);
    return null;
  }
}

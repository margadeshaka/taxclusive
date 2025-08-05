import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    timestamp: string;
    version: string;
  };
}

export class ApiResponseHandler {
  private static readonly API_VERSION = "1.0.0";

  static success<T>(
    data: T,
    message?: string,
    status: number = 200
  ): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
        metadata: {
          timestamp: new Date().toISOString(),
          version: this.API_VERSION,
        },
      },
      { status }
    );
  }

  static error(
    error: string,
    status: number = 500,
    data?: any
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          version: this.API_VERSION,
        },
      },
      { status }
    );
  }

  static unauthorized(message: string = "Unauthorized"): NextResponse<ApiResponse> {
    return this.error(message, 401);
  }

  static forbidden(message: string = "Forbidden"): NextResponse<ApiResponse> {
    return this.error(message, 403);
  }

  static notFound(message: string = "Resource not found"): NextResponse<ApiResponse> {
    return this.error(message, 404);
  }

  static badRequest(message: string = "Bad request"): NextResponse<ApiResponse> {
    return this.error(message, 400);
  }

  static validationError(errors: any): NextResponse<ApiResponse> {
    return this.error("Validation failed", 422, errors);
  }
}
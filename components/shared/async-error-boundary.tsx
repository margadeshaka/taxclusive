"use client";

import React, { useEffect } from "react";
import { ErrorBoundary } from "./error-boundary";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AsyncErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
}

function AsyncErrorFallback({ error, resetError }: AsyncErrorFallbackProps) {
  const isNetworkError = error.message.toLowerCase().includes("network") ||
                        error.message.toLowerCase().includes("fetch");
  
  return (
    <div className="flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <div className="flex justify-center">
          <RefreshCw className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          {isNetworkError ? "Connection Error" : "Loading Error"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isNetworkError
            ? "Please check your internet connection and try again."
            : "We couldn't load this content. Please try again."}
        </p>
        {process.env.NODE_ENV === "development" && (
          <Alert variant="destructive" className="text-left">
            <AlertDescription className="text-xs font-mono">
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={resetError} size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function AsyncErrorBoundary({ children, onError }: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(props) => {
        useEffect(() => {
          if (onError) {
            onError(props.error, props.errorInfo);
          }
        }, [props.error, props.errorInfo]);
        
        return <AsyncErrorFallback {...props} />;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({ message = "Loading..." }: LoadingFallbackProps) {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
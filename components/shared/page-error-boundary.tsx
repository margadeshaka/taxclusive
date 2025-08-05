"use client";

import { AlertTriangle } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import { ErrorBoundary } from "./error-boundary";

interface PageErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
}

function PageErrorFallback({ error, resetError }: PageErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">
          We encountered an error while loading this page. This is usually temporary.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-muted rounded-lg text-left">
            <p className="text-sm font-mono text-destructive">{error.message}</p>
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <Button onClick={resetError}>Try Again</Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PageErrorBoundaryProps {
  children: React.ReactNode;
}

export function PageErrorBoundary({ children }: PageErrorBoundaryProps) {
  return <ErrorBoundary fallback={PageErrorFallback}>{children}</ErrorBoundary>;
}
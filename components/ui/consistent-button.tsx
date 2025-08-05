"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface ConsistentButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const ConsistentButton = React.forwardRef<HTMLButtonElement, ConsistentButtonProps>(
  ({ className, loading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "font-medium transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || "Loading..."}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

ConsistentButton.displayName = "ConsistentButton";

export { ConsistentButton };
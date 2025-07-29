"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "password";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, leftIcon, rightIcon, variant = "default", ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    // Determine the actual input type
    const inputType = React.useMemo(() => {
      if (variant === "password") {
        return showPassword ? "text" : "password";
      }
      return type;
    }, [variant, showPassword, type]);

    // Determine left icon
    const leftIconElement = React.useMemo(() => {
      if (variant === "password" && !leftIcon) {
        return <Lock className="h-4 w-4" />;
      }
      return leftIcon;
    }, [variant, leftIcon]);

    // Determine right icon
    const rightIconElement = React.useMemo(() => {
      if (variant === "password") {
        return (
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </div>
        );
      }
      return rightIcon;
    }, [variant, showPassword, rightIcon]);

    return (
      <div className="relative">
        {leftIconElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none">
            {leftIconElement}
          </div>
        )}
        <input
          type={inputType}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground/60 text-sm selection:bg-primary !py-0 selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-primary focus-visible:ring-accent/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            leftIconElement ? "pl-10" : "px-3",
            rightIconElement ? "pr-10" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIconElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
            {rightIconElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

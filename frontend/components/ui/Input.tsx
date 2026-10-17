import React, { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="label block mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-transparent border-b border-line px-0 py-3 text-base text-charcoal placeholder:text-muted focus:outline-none focus:border-champagne transition-colors",
            error && "border-burgundy focus:border-burgundy",
            className
          )}
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-burgundy">{error}</p>}
        {hint && !error && <p className="mt-2 text-sm text-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
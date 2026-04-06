import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-dark">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 sm:px-4 py-3 sm:py-2.5 rounded-lg border border-border-soft bg-white text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-base sm:text-sm",
            error && "border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        >
          <option value="">Pilih...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

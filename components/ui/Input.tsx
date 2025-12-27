import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3',
            'text-base text-text',
            'bg-gray-100 border border-transparent rounded-md',
            'transition-all duration-fast ease-out',
            'placeholder:text-gray-400',
            'focus:bg-white focus:border-gray-900 focus:outline-none',
            'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-small text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-small text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

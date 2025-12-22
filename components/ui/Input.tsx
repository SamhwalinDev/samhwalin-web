import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Input
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

// Textarea
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-body-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 min-h-[120px]',
            'text-base text-text leading-relaxed',
            'bg-gray-100 border border-transparent rounded-md',
            'transition-all duration-fast ease-out',
            'placeholder:text-gray-400',
            'focus:bg-white focus:border-gray-900 focus:outline-none',
            'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
            'resize-y',
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

Textarea.displayName = 'Textarea';

// Checkbox
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            'mt-1 h-4 w-4',
            'text-gray-900 border-gray-300 rounded',
            'focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
            className
          )}
          {...props}
        />
        <div>
          <label
            htmlFor={checkboxId}
            className="text-body-sm text-gray-700 cursor-pointer"
          >
            {label}
          </label>
          {error && (
            <p className="mt-1 text-small text-error">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Input, Textarea, Checkbox };

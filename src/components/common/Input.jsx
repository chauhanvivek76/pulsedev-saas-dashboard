import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Accessible Input Component
 */
export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className,
  wrapperClassName,
  required = false,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = props.id || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={cn('flex flex-col gap-1.5 text-left w-full', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-slate-305 flex items-center justify-between select-none"
        >
          <span>
            {label}
            {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <input
        ref={ref}
        id={id}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={cn(
          error ? errorId : null,
          helperText ? helperId : null
        ) || undefined}
        className={cn(
          'w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-900 border text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-2',
          error 
            ? 'border-red-550 focus:border-red-600 focus:ring-red-500' 
            : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500',
          className
        )}
        {...props}
      />

      {error ? (
        <p
          id={errorId}
          className="text-xs text-red-650 dark:text-red-400 animate-slide-down font-medium"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="text-xs text-slate-400 dark:text-slate-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

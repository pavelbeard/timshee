/**
 * Input component with proper styling and validation states
 */

import React from 'react';
import { cn } from '../../shared/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('flex flex-col', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={cn(
          'px-3 py-2 border rounded-md shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'placeholder:text-gray-400',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

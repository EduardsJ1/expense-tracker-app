import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    error = false, 
    errorMessage, 
    label, 
    helperText, 
    variant = 'default',
    inputSize = 'md', 
    className = '',
    ...props 
  }, ref) => {
    
    const baseClasses = "w-full border rounded-xl focus:outline-none focus:ring-1 transition-colors duration-200 shadow-sm bg-white placeholder-gray-400";
    
    const sizeClasses = {
      sm: "py-1 px-2 text-sm",
      md: "py-2 px-3 text-base", 
      lg: "py-3 px-4 text-lg"
    };
    
    const stateClasses = error 
      ? "focus:ring-red-400 border-red-300 text-red-900" 
      : "focus:ring-blue-500 border-gray-300 hover:border-gray-400";

    const inputClasses = `${baseClasses} ${sizeClasses[inputSize]} ${stateClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {error && errorMessage && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
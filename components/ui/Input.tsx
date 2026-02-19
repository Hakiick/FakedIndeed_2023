'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {rest.required && (
          <span className="ml-1 text-red-600" aria-hidden="true">*</span>
        )}
      </label>
      <input
        {...rest}
        id={inputId}
        aria-describedby={
          [error ? errorId : '', helperText ? helperTextId : ''].filter(Boolean).join(' ') || undefined
        }
        aria-invalid={error ? 'true' : undefined}
        className={[
          'w-full min-h-[44px] rounded-lg border px-4 py-2.5 text-base transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1',
          error
            ? 'border-red-500 bg-red-50 placeholder-red-400'
            : 'border-slate-300 bg-white placeholder-gray-400 hover:border-slate-400',
          rest.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperTextId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

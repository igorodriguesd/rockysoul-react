import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  hint?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  hint,
  required = false,
  id,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      />
      {hint && !error && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠️</span>
          {error.message}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  hint?: string;
  charCount?: number;
  maxCharCount?: number;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  hint,
  charCount = 0,
  maxCharCount,
  required = false,
  id,
  ...props
}: FormTextareaProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {maxCharCount && (
          <span className="text-xs text-gray-500">
            {charCount}/{maxCharCount}
          </span>
        )}
      </div>
      <textarea
        id={id}
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors resize-none bg-white/60 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      />
      {hint && !error && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠️</span>
          {error.message}
        </p>
      )}
    </div>
  );
}

interface FormErrorProps {
  error?: FieldError;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  return (
    <p className="text-red-500 text-xs flex items-center gap-1">
      <span>⚠️</span>
      {error.message}
    </p>
  );
}

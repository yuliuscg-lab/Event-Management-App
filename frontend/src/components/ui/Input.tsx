import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2.5 bg-slate-900/60 border ${
          error ? 'border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
        } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 text-sm ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-400 mt-1 font-medium">{error}</span>}
    </div>
  );
};
export default Input;

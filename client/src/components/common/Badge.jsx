import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/80',
    income: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    expense: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/80',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/80',
  };

  const dotColors = {
    default: 'bg-slate-400',
    brand: 'bg-brand-500',
    income: 'bg-emerald-500',
    expense: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-current'}`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

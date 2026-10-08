import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  glow = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${
        glass
          ? 'bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm'
          : 'bg-white border border-slate-200 shadow-sm'
      } ${hoverEffect ? 'hover:shadow-md hover:border-brand-200/80 hover:-translate-y-0.5' : ''} ${
        glow ? 'ring-1 ring-brand-500/20 shadow-glow' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

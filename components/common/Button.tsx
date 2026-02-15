import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-sans tracking-wider rounded-full transition-all duration-300 text-center';

  const variants = {
    primary: 'bg-charcoal text-snow hover:bg-charcoal-light',
    secondary: 'bg-stone text-snow hover:bg-stone-warm',
    outline:
      'border border-charcoal/20 text-charcoal hover:border-charcoal/50 bg-transparent',
    ghost:
      'text-charcoal hover:text-stone bg-transparent',
  };

  const sizes = {
    sm: 'px-5 py-2 text-xs uppercase',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-sm uppercase',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}

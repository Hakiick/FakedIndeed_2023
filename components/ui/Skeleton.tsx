import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle';
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const variantClasses: Record<NonNullable<SkeletonProps['variant']>, string> = {
    text: 'h-4 rounded-md',
    card: 'h-32 rounded-xl',
    circle: 'rounded-full',
  };

  const circleDefault = variant === 'circle' ? 'w-12 h-12' : '';

  return (
    <div
      aria-hidden="true"
      style={{ width, height }}
      className={[
        'animate-pulse bg-gray-200',
        variantClasses[variant],
        circleDefault,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

import clsx from 'clsx';

const variants = {
  primary: 'bg-clay-500 text-white hover:bg-clay-600 disabled:bg-clay-200',
  outline: 'border border-clay-400 text-clay-600 bg-transparent hover:bg-clay-50 disabled:opacity-50',
  neutral: 'bg-ink-50 text-ink-800 hover:bg-ink-100 disabled:opacity-50',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-50 disabled:opacity-50',
  dark: 'bg-ink-800 text-white hover:bg-ink-900 disabled:opacity-50',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

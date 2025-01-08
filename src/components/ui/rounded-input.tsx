import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const RoundedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-full border border-border bg-transparent px-4 py-3 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9CA3AF] placeholder:font-medium focus-visible:outline-none focus-visible:border-secondary-foreground focus-visible:ring-[#CBE1FF] disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-2 focus-within:ring-[#CBE1FF]',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
RoundedInput.displayName = 'Input';

export { RoundedInput };

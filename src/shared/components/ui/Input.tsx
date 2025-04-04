import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Label } from './Label';
import { ReactNode } from 'react';

interface Props extends React.ComponentProps<'input'> {
  name: string;
  label: ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, type, name, id = name, label, ...props }, ref) => {
    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <input
          {...{
            id,
            name,
            type,
            className: cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              className
            ),
            autoComplete: 'off',
            ref,
            ...props,
          }}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

import * as React from 'react'

import { cn } from '~/lib/utils'

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
          className
        )}
        {...props}
      />
    )
  }
)
Field.displayName = 'Field'

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    )
  }
)
FieldLabel.displayName = 'FieldLabel'

export { Field, FieldLabel }

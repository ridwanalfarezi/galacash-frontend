import * as React from 'react'

import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number | string
  onValueChange: (value: number) => void
  placeholder?: string
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onValueChange, placeholder = 'Rp 0', ...props }, ref) => {
    // Format the display value
    const displayValue = React.useMemo(() => {
      if (value === 0 || value === '0' || value === '') return ''
      return `Rp ${Number(value).toLocaleString('id-ID')}`
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '')
      const numericValue = rawValue === '' ? 0 : Number(rawValue)
      onValueChange(numericValue)
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = 'CurrencyInput'

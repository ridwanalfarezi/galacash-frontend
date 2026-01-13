'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'

interface DatePickerProps {
  date?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
}

export function SingleDatePicker({ date, onChange, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 border-gray-900 px-3 py-1 text-left font-normal text-gray-900 hover:bg-gray-50 hover:text-gray-900',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-900" />
          {date ? format(date, 'EEEE, dd MMMM yyyy') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => {
            onChange?.(selected)
          }}
          numberOfMonths={1}
          animate
        />
      </PopoverContent>
    </Popover>
  )
}

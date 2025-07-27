import clsx from 'clsx'
import type { ComponentProps } from 'react'

const Alert = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('fill-current', props.className)}
      {...props}
    >
      <path
        d="M16.0003 10.917V16.2503M16.0003 21.5837H16.0137M29.3337 16.2503C29.3337 23.6141 23.3641 29.5837 16.0003 29.5837C8.63653 29.5837 2.66699 23.6141 2.66699 16.2503C2.66699 8.88653 8.63653 2.91699 16.0003 2.91699C23.3641 2.91699 29.3337 8.88653 29.3337 16.2503Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Alert
